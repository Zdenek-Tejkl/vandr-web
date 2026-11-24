-- Opravy po review:
-- - pozvánky: duplicity podle normalizovaného e-mailu, nepozveš sám sebe, limit na jednu IP
-- - zápis existujícího e-mailu neprozradí pořadí ani kód a neobnoví odhlášení
-- - odhlášení záznam smaže a odečte pozvánku
-- - limit pro počítání návštěv a pravidelný úklid (pg_cron, pokud je k dispozici)
-- Zpětně kompatibilní: RPC mají stejná jména i parametry, nové parametry mají výchozí hodnotu.

-- 1. Sloupce a indexy -----------------------------------------------------

-- Klíč jen pro hledání duplicit: Gmail bez teček, všude bez +štítku.
create or replace function vandr.waitlist_email_key(p_email text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when p.d in ('gmail.com', 'googlemail.com') then replace(p.l, '.', '') || '@gmail.com'
    else p.l || '@' || p.d
  end
  from (
    select coalesce(nullif(split_part(split_part(s.e, '@', 1), '+', 1), ''), split_part(s.e, '@', 1)) as l,
           split_part(s.e, '@', 2) as d
    from (select lower(btrim(coalesce(p_email, ''))) as e) s
  ) p
$$;

alter table vandr.waitlist add column if not exists email_key text
  generated always as (vandr.waitlist_email_key(email)) stored;
create index if not exists waitlist_email_key_idx on vandr.waitlist (email_key);

-- Otisk IP při zápisu (proti pozvání sama sebe). Po 30 dnech ho maže waitlist_purge.
alter table vandr.waitlist add column if not exists ip_hash text;

-- Pokusy rozlišené podle druhu: zápis (join) a návštěva (view).
alter table vandr.waitlist_attempts add column if not exists kind text not null default 'join';
create index if not exists waitlist_attempts_created_idx on vandr.waitlist_attempts (created_at);

-- 2. Pomocné funkce -------------------------------------------------------

-- Limit pokusů z jedné IP za 10 minut. Bez otisku IP vždy projde.
create or replace function vandr.waitlist_rate_ok(p_ip_hash text, p_kind text, p_max integer)
returns boolean
language plpgsql
volatile
set search_path = ''
as $$
declare
  v_attempts integer;
begin
  if p_ip_hash is null then
    return true;
  end if;
  select count(*) into v_attempts
  from vandr.waitlist_attempts
  where ip_hash = p_ip_hash and kind = p_kind and created_at > now() - interval '10 minutes';
  if v_attempts >= p_max then
    return false;
  end if;
  insert into vandr.waitlist_attempts (ip_hash, kind) values (p_ip_hash, p_kind);
  return true;
end;
$$;

-- Odpověď pro e-mail, který už na seznamu je: bez pořadí, kódu a pozvánek.
-- S p_resend vrátí údaje pro nové poslání uvítacího e-mailu, nejvýš jednou za hodinu.
-- Tyhle údaje čte jen server, do prohlížeče nejdou.
create or replace function vandr.waitlist_exists_payload(p_row vandr.waitlist, p_resend boolean)
returns jsonb
language plpgsql
volatile
set search_path = ''
as $$
declare
  v_sent boolean := false;
begin
  if coalesce(p_resend, false) then
    update vandr.waitlist
    set confirmation_sent_at = now()
    where id = p_row.id
      and (confirmation_sent_at is null or confirmation_sent_at < now() - interval '1 hour');
    v_sent := found;
  end if;

  return jsonb_build_object('status', 'exists', 'total', vandr.waitlist_count())
    || case when v_sent then jsonb_build_object('resend', jsonb_build_object(
      'email', p_row.email,
      'code', p_row.code,
      'position', vandr.waitlist_position(p_row.id),
      'unsubscribe_token', p_row.unsubscribe_token
    )) else '{}'::jsonb end;
end;
$$;

-- Úklid: pokusy po 24 h, návštěvy po 90 dnech, otisk IP u zápisu po 30 dnech.
-- Zbytky starého odhlašování (jen značka) odečte z pozvánek a smaže.
create or replace function vandr.waitlist_purge()
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  delete from vandr.waitlist_attempts where created_at < now() - interval '1 day';
  delete from vandr.waitlist_views where created_at < now() - interval '90 days';
  update vandr.waitlist set ip_hash = null
  where ip_hash is not null and created_at < now() - interval '30 days';

  update vandr.waitlist r
  set referral_count = greatest(r.referral_count - s.n, 0)
  from (
    select referred_by, count(*)::integer as n
    from vandr.waitlist
    where unsubscribed_at is not null and referral_counted and referred_by is not null
    group by referred_by
  ) s
  where r.id = s.referred_by;
  delete from vandr.waitlist where unsubscribed_at is not null;
end;
$$;

-- 3. API ------------------------------------------------------------------

drop function if exists vandr.waitlist_join(text, text, text, text, text, text, text, text, boolean);

create or replace function vandr.waitlist_join(
  p_email text,
  p_ref text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_utm_content text default null,
  p_variant text default null,
  p_ip_hash text default null,
  p_require_confirm boolean default true,
  p_resend boolean default false
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_key text;
  v_row vandr.waitlist;
  v_ref vandr.waitlist;
  v_ref_id bigint;
begin
  if length(v_email) > 254 or v_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$' then
    return jsonb_build_object('status', 'invalid');
  end if;

  -- Limit pokusů jde první, ať se nedá hromadně zjišťovat, kdo je na seznamu.
  delete from vandr.waitlist_attempts where created_at < now() - interval '1 day';
  if not vandr.waitlist_rate_ok(p_ip_hash, 'join', 10) then
    return jsonb_build_object('status', 'rate_limited');
  end if;

  -- Stejná adresa v jiném tvaru (tečky, +štítek) je duplicita. Souběžné zápisy jdou po sobě.
  v_key := vandr.waitlist_email_key(v_email);
  perform pg_advisory_xact_lock(hashtext('vandr.waitlist:' || v_key));

  -- Už na seznamu: jen stav. Odhlášený záznam neexistuje, takže nic neobnovujeme.
  select * into v_row from vandr.waitlist where email_key = v_key order by id limit 1;
  if found then
    return vandr.waitlist_exists_payload(v_row, p_resend);
  end if;

  if p_ref is not null and p_ref <> '' then
    select * into v_ref
    from vandr.waitlist
    where code = upper(left(p_ref, 12)) and unsubscribed_at is null;
    v_ref_id := v_ref.id;
    -- Sám sebe nepozveš (stejná IP jako při zápisu toho, kdo zve)
    -- a z jedné IP se stejnému člověku připíšou nejvýš 2 pozvánky.
    if v_ref_id is not null and p_ip_hash is not null and (
      v_ref.ip_hash = p_ip_hash
      or (select count(*) from vandr.waitlist where referred_by = v_ref_id and ip_hash = p_ip_hash) >= 2
    ) then
      v_ref_id := null;
    end if;
  end if;

  for attempt in 1..5 loop
    begin
      insert into vandr.waitlist (
        email, code, referred_by, referral_counted, ip_hash,
        utm_source, utm_medium, utm_campaign, utm_content, variant
      ) values (
        v_email,
        vandr.waitlist_new_code(),
        v_ref_id,
        v_ref_id is not null and not coalesce(p_require_confirm, true),
        left(p_ip_hash, 64),
        left(p_utm_source, 64),
        left(p_utm_medium, 64),
        left(p_utm_campaign, 64),
        left(p_utm_content, 64),
        left(p_variant, 8)
      )
      returning * into v_row;
      exit;
    exception when unique_violation then
      select * into v_row from vandr.waitlist where lower(email) = v_email;
      if found then
        return vandr.waitlist_exists_payload(v_row, false);
      end if;
    end;
  end loop;

  if v_row.id is null then
    return jsonb_build_object('status', 'error');
  end if;

  if v_row.referral_counted then
    update vandr.waitlist set referral_count = referral_count + 1 where id = v_ref_id;
  end if;

  return vandr.waitlist_payload(v_row, 'created')
    || jsonb_build_object(
      'answer_token', v_row.answer_token,
      'unsubscribe_token', v_row.unsubscribe_token,
      'confirm_token', v_row.confirm_token
    );
end;
$$;

-- Odhlášení záznam smaže. Kdo tě pozval, přijde o započítanou pozvánku.
-- Pozvaní kamarádi zůstávají (referred_by se nastaví na null).
create or replace function vandr.waitlist_unsubscribe(p_code text, p_token uuid)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_row vandr.waitlist;
begin
  delete from vandr.waitlist
  where code = upper(left(p_code, 12)) and unsubscribe_token = p_token
  returning * into v_row;
  if not found then
    return false;
  end if;
  if v_row.referral_counted and v_row.referred_by is not null then
    update vandr.waitlist set referral_count = greatest(referral_count - 1, 0) where id = v_row.referred_by;
  end if;
  return true;
end;
$$;

drop function if exists vandr.waitlist_log_view(text, text, text, text, boolean);

-- Návštěva: nejvýš 30 za 10 minut z jedné IP, víc tiše zahodíme.
create or replace function vandr.waitlist_log_view(
  p_variant text default null,
  p_utm_source text default null,
  p_utm_campaign text default null,
  p_utm_content text default null,
  p_has_ref boolean default false,
  p_ip_hash text default null
)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  if not vandr.waitlist_rate_ok(p_ip_hash, 'view', 30) then
    return;
  end if;
  insert into vandr.waitlist_views (variant, utm_source, utm_campaign, utm_content, has_ref)
  values (left(p_variant, 8), left(p_utm_source, 64), left(p_utm_campaign, 64), left(p_utm_content, 64), coalesce(p_has_ref, false));
end;
$$;

-- Všechny funkce waiting listu jen pro server.
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

-- 4. Úklid ----------------------------------------------------------------

-- Dosavadní odhlášení (jen značka) teď smažeme.
select vandr.waitlist_purge();

-- Denně ve 3:17 UTC, pokud je v projektu zapnutý pg_cron. Bez něj zápis maže jen staré pokusy.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    execute $cron$select cron.schedule('vandr-waitlist-purge', '17 3 * * *', 'select vandr.waitlist_purge()')$cron$;
  end if;
end;
$$;
