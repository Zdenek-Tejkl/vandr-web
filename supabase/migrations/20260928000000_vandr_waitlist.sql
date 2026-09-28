-- Vandr waiting list.
-- Everything lives in the dedicated schema "vandr" so it stays separate from
-- other products in the same Supabase project (their tables live in "public").
-- Only the server (service_role) talks to these objects, never the browser.

create schema if not exists vandr;
grant usage on schema vandr to service_role;

-- 1. Tables ---------------------------------------------------------------

create table if not exists vandr.waitlist (
  id bigint generated always as identity primary key,
  email text not null,
  code text not null unique,
  referred_by bigint references vandr.waitlist (id) on delete set null,
  referral_count integer not null default 0,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  variant text,
  next_destination text,
  answer_token uuid not null default gen_random_uuid(),
  unsubscribe_token uuid not null default gen_random_uuid(),
  unsubscribed_at timestamptz,
  confirmation_sent_at timestamptz,
  created_at timestamptz not null default now(),
  constraint waitlist_email_format check (
    length(email) <= 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'
  )
);

comment on table vandr.waitlist is 'Vandr waiting list: e-mail, pozvánkový kód, pořadí, zdroj (UTM) a odpověď "kam jedeš".';

create unique index if not exists waitlist_email_lower_key on vandr.waitlist (lower(email));
create index if not exists waitlist_referred_by_idx on vandr.waitlist (referred_by);

-- Anti spam: hashed IP (HMAC, never the raw IP), kept for max 1 day.
create table if not exists vandr.waitlist_attempts (
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists waitlist_attempts_ip_idx on vandr.waitlist_attempts (ip_hash, created_at);

-- Cookieless page views, so conversion can be measured per source, video and headline.
create table if not exists vandr.waitlist_views (
  id bigint generated always as identity primary key,
  variant text,
  utm_source text,
  utm_campaign text,
  utm_content text,
  has_ref boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists waitlist_views_created_idx on vandr.waitlist_views (created_at);

alter table vandr.waitlist enable row level security;
alter table vandr.waitlist_attempts enable row level security;
alter table vandr.waitlist_views enable row level security;

-- No policies on purpose: anon and authenticated have no access at all.
revoke all on vandr.waitlist, vandr.waitlist_attempts, vandr.waitlist_views from anon, authenticated;

-- 2. Helpers --------------------------------------------------------------

-- How many places one invited friend moves you forward.
create or replace function vandr.waitlist_referral_boost()
returns integer
language sql
immutable
set search_path = ''
as $$ select 10 $$;

create or replace function vandr.waitlist_new_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  bytes bytea := extensions.gen_random_bytes(6);
  result text := '';
begin
  for i in 0..5 loop
    result := result || substr(alphabet, (get_byte(bytes, i) % 32) + 1, 1);
  end loop;
  return result;
end;
$$;

-- Queue position: earlier signup wins, every referral jumps you forward.
create or replace function vandr.waitlist_position(p_id bigint)
returns integer
language sql
stable
set search_path = ''
as $$
  select 1 + count(*)::integer
  from vandr.waitlist w, vandr.waitlist me
  where me.id = p_id
    and w.id <> me.id
    and w.unsubscribed_at is null
    and (w.id - w.referral_count * vandr.waitlist_referral_boost(), w.id)
      < (me.id - me.referral_count * vandr.waitlist_referral_boost(), me.id)
$$;

create or replace function vandr.waitlist_count()
returns integer
language sql
stable
security definer
set search_path = ''
as $$ select count(*)::integer from vandr.waitlist where unsubscribed_at is null $$;

create or replace function vandr.waitlist_payload(p_row vandr.waitlist, p_status text)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'status', p_status,
    'position', vandr.waitlist_position(p_row.id),
    'code', p_row.code,
    'referrals', p_row.referral_count,
    'total', (select count(*) from vandr.waitlist where unsubscribed_at is null)
  )
$$;

-- 3. API used by the web server (service_role only) -----------------------

create or replace function vandr.waitlist_join(
  p_email text,
  p_ref text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_utm_content text default null,
  p_variant text default null,
  p_ip_hash text default null
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_row vandr.waitlist;
  v_ref_id bigint;
  v_attempts integer;
begin
  if length(v_email) > 254 or v_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$' then
    return jsonb_build_object('status', 'invalid');
  end if;

  -- Already on the list: show the position, not an error.
  select * into v_row from vandr.waitlist where lower(email) = v_email;
  if found then
    if v_row.unsubscribed_at is not null then
      update vandr.waitlist set unsubscribed_at = null where id = v_row.id returning * into v_row;
    end if;
    return vandr.waitlist_payload(v_row, 'exists');
  end if;

  if p_ip_hash is not null then
    delete from vandr.waitlist_attempts where created_at < now() - interval '1 day';
    select count(*) into v_attempts
    from vandr.waitlist_attempts
    where ip_hash = p_ip_hash and created_at > now() - interval '10 minutes';
    if v_attempts >= 10 then
      return jsonb_build_object('status', 'rate_limited');
    end if;
    insert into vandr.waitlist_attempts (ip_hash) values (p_ip_hash);
  end if;

  if p_ref is not null and p_ref <> '' then
    select id into v_ref_id
    from vandr.waitlist
    where code = upper(left(p_ref, 12)) and unsubscribed_at is null;
  end if;

  for attempt in 1..5 loop
    begin
      insert into vandr.waitlist (
        email, code, referred_by, utm_source, utm_medium, utm_campaign, utm_content, variant
      ) values (
        v_email,
        vandr.waitlist_new_code(),
        v_ref_id,
        left(p_utm_source, 64),
        left(p_utm_medium, 64),
        left(p_utm_campaign, 64),
        left(p_utm_content, 64),
        left(p_variant, 8)
      )
      returning * into v_row;
      exit;
    exception when unique_violation then
      -- Same e-mail inserted concurrently, or a rare code collision (retry).
      select * into v_row from vandr.waitlist where lower(email) = v_email;
      if found then
        return vandr.waitlist_payload(v_row, 'exists');
      end if;
    end;
  end loop;

  if v_row.id is null then
    return jsonb_build_object('status', 'error');
  end if;

  if v_ref_id is not null then
    update vandr.waitlist set referral_count = referral_count + 1 where id = v_ref_id;
  end if;

  return vandr.waitlist_payload(v_row, 'created')
    || jsonb_build_object(
      'answer_token', v_row.answer_token,
      'unsubscribe_token', v_row.unsubscribe_token
    );
end;
$$;

create or replace function vandr.waitlist_status(p_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_row vandr.waitlist;
begin
  select * into v_row from vandr.waitlist where code = upper(left(p_code, 12)) and unsubscribed_at is null;
  if not found then
    return null;
  end if;
  return vandr.waitlist_payload(v_row, 'exists');
end;
$$;

create or replace function vandr.waitlist_answer(p_code text, p_token uuid, p_answer text)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  update vandr.waitlist
  set next_destination = left(btrim(p_answer), 200)
  where code = upper(left(p_code, 12)) and answer_token = p_token;
  return found;
end;
$$;

create or replace function vandr.waitlist_unsubscribe(p_code text, p_token uuid)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  update vandr.waitlist
  set unsubscribed_at = coalesce(unsubscribed_at, now())
  where code = upper(left(p_code, 12)) and unsubscribe_token = p_token;
  return found;
end;
$$;

create or replace function vandr.waitlist_mark_confirmation_sent(p_code text)
returns void
language sql
volatile
security definer
set search_path = ''
as $$
  update vandr.waitlist set confirmation_sent_at = now() where code = upper(left(p_code, 12))
$$;

create or replace function vandr.waitlist_log_view(
  p_variant text default null,
  p_utm_source text default null,
  p_utm_campaign text default null,
  p_utm_content text default null,
  p_has_ref boolean default false
)
returns void
language sql
volatile
security definer
set search_path = ''
as $$
  insert into vandr.waitlist_views (variant, utm_source, utm_campaign, utm_content, has_ref)
  values (left(p_variant, 8), left(p_utm_source, 64), left(p_utm_campaign, 64), left(p_utm_content, 64), coalesce(p_has_ref, false))
$$;

-- Lock every waitlist function down to the server.
do $$
declare
  f text;
begin
  for f in
    select p.oid::regprocedure::text
    from pg_proc p
    where p.pronamespace = 'vandr'::regnamespace and p.proname like 'waitlist%'
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', f);
    execute format('grant execute on function %s to service_role', f);
  end loop;
end;
$$;

-- 4. Reports (read them in the Supabase SQL editor) -----------------------

create or replace view vandr.waitlist_conversion
with (security_invoker = true) as
with v as (
  select coalesce(utm_source, '(přímo)') as src, coalesce(utm_content, '-') as content,
         coalesce(variant, 'a') as variant, count(*) as views
  from vandr.waitlist_views group by 1, 2, 3
), s as (
  select coalesce(utm_source, '(přímo)') as src, coalesce(utm_content, '-') as content,
         coalesce(variant, 'a') as variant, count(*) as signups,
         count(*) filter (where referral_count > 0) as inviters,
         count(*) filter (where referred_by is not null) as referred
  from vandr.waitlist group by 1, 2, 3
)
select
  coalesce(v.src, s.src) as zdroj,
  coalesce(v.content, s.content) as video,
  coalesce(v.variant, s.variant) as varianta,
  coalesce(v.views, 0) as navstevy,
  coalesce(s.signups, 0) as zapisy,
  round(100.0 * coalesce(s.signups, 0) / nullif(v.views, 0), 1) as konverze_pct,
  round(100.0 * coalesce(s.inviters, 0) / nullif(s.signups, 0), 1) as pozvali_nekoho_pct,
  coalesce(s.referred, 0) as prisli_z_pozvanky
from v
full join s on v.src = s.src and v.content = s.content and v.variant = s.variant
order by navstevy desc, zapisy desc;

create or replace view vandr.waitlist_weekly
with (security_invoker = true) as
with v as (
  select date_trunc('week', created_at)::date as tyden, count(*) as views
  from vandr.waitlist_views group by 1
), s as (
  select date_trunc('week', created_at)::date as tyden, count(*) as signups,
         count(*) filter (where referred_by is not null) as referred
  from vandr.waitlist group by 1
)
select
  coalesce(v.tyden, s.tyden) as tyden,
  coalesce(v.views, 0) as navstevy,
  coalesce(s.signups, 0) as zapisy,
  round(100.0 * coalesce(s.signups, 0) / nullif(v.views, 0), 1) as konverze_pct,
  coalesce(s.referred, 0) as prisli_z_pozvanky
from v
full join s on v.tyden = s.tyden
order by tyden desc;

revoke all on vandr.waitlist_conversion, vandr.waitlist_weekly from public, anon, authenticated;
