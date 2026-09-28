-- Potvrzení e-mailu: pozvaný kamarád se započítá až po potvrzení.
-- (Když web nemá nastavené posílání e-mailů, počítá se hned.)

alter table vandr.waitlist add column if not exists confirm_token uuid not null default gen_random_uuid();
alter table vandr.waitlist add column if not exists confirmed_at timestamptz;
alter table vandr.waitlist add column if not exists referral_counted boolean not null default false;

-- Dosavadní pozvánky už byly započítané.
update vandr.waitlist set referral_counted = true where referred_by is not null and not referral_counted;

drop function if exists vandr.waitlist_join(text, text, text, text, text, text, text, text);

create or replace function vandr.waitlist_join(
  p_email text,
  p_ref text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_utm_content text default null,
  p_variant text default null,
  p_ip_hash text default null,
  p_require_confirm boolean default true
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

  -- Už na seznamu: ukážeme pořadí, ne chybu.
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
        email, code, referred_by, referral_counted,
        utm_source, utm_medium, utm_campaign, utm_content, variant
      ) values (
        v_email,
        vandr.waitlist_new_code(),
        v_ref_id,
        v_ref_id is not null and not coalesce(p_require_confirm, true),
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
        return vandr.waitlist_payload(v_row, 'exists');
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

create or replace function vandr.waitlist_confirm(p_code text, p_token uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_row vandr.waitlist;
begin
  update vandr.waitlist
  set confirmed_at = coalesce(confirmed_at, now())
  where code = upper(left(p_code, 12)) and confirm_token = p_token
  returning * into v_row;

  if not found then
    return null;
  end if;

  if v_row.referred_by is not null then
    -- Podmínka v UPDATE brání dvojímu započítání při souběžném kliknutí.
    update vandr.waitlist set referral_counted = true where id = v_row.id and not referral_counted;
    if found then
      update vandr.waitlist set referral_count = referral_count + 1 where id = v_row.referred_by;
    end if;
  end if;

  return vandr.waitlist_payload(v_row, 'exists');
end;
$$;

do $$
declare
  f text;
begin
  for f in
    select p.oid::regprocedure::text
    from pg_proc p
    where p.pronamespace = 'vandr'::regnamespace and p.proname in ('waitlist_join', 'waitlist_confirm')
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', f);
    execute format('grant execute on function %s to service_role', f);
  end loop;
end;
$$;
