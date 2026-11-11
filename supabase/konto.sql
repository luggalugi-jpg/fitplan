-- =====================================================================
-- GainPilot – Konten und Cloud-Sicherung
-- Einrichtung: Supabase-Dashboard → SQL Editor → New query →
-- diesen kompletten Text einfügen → Run (bei der RLS-Frage „Run and enable RLS“).
-- Setzt rangliste.sql voraus. Kann gefahrlos mehrfach ausgeführt werden.
-- =====================================================================

create table if not exists public.gp_backup(
  uid uuid primary key references auth.users(id) on delete cascade,
  data text not null,               -- komprimierte Sicherung (gzip, Base64)
  bytes int not null,
  app_version text,
  device text,
  updated_at timestamptz not null default now()
);
alter table public.gp_backup enable row level security;
revoke all on public.gp_backup from anon, authenticated;

-- Hat der Aufrufer ein richtiges Konto (E-Mail bestätigt, nicht anonym)?
create or replace function public.gp_ist_konto() returns boolean
language sql stable security definer set search_path = public, auth as $$
  select exists (select 1 from auth.users u
                  where u.id = auth.uid() and coalesce(u.is_anonymous, false) = false
                    and u.email is not null and u.email_confirmed_at is not null)
$$;

-- Sicherung speichern (überschreibt die vorige)
create or replace function public.gp_sicherung_speichern(p_data text, p_version text default null, p_geraet text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); n int := length(coalesce(p_data, ''));
begin
  if not gp_ist_konto() then return jsonb_build_object('ok', false, 'fehler', 'Für die Cloud-Sicherung brauchst du ein bestätigtes Konto.'); end if;
  if n < 20 then return jsonb_build_object('ok', false, 'fehler', 'Leere Sicherung.'); end if;
  if n > 8000000 then return jsonb_build_object('ok', false, 'fehler', 'Die Sicherung ist zu groß.'); end if;
  insert into gp_backup(uid, data, bytes, app_version, device, updated_at)
  values (u, p_data, n, left(p_version, 20), left(p_geraet, 60), now())
  on conflict (uid) do update set data = excluded.data, bytes = excluded.bytes, app_version = excluded.app_version,
     device = excluded.device, updated_at = now();
  return jsonb_build_object('ok', true, 'zeit', now());
end $$;

-- Infos zur vorhandenen Sicherung (ohne Inhalt)
create or replace function public.gp_sicherung_info() returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); b gp_backup;
begin
  select * into b from gp_backup where uid = u;
  if b.uid is null then return jsonb_build_object('ok', true, 'vorhanden', false, 'konto', gp_ist_konto()); end if;
  return jsonb_build_object('ok', true, 'vorhanden', true, 'konto', gp_ist_konto(), 'zeit', b.updated_at, 'bytes', b.bytes,
    'version', b.app_version, 'geraet', b.device);
end $$;

-- Sicherung laden
create or replace function public.gp_sicherung_laden() returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); b gp_backup;
begin
  if not gp_ist_konto() then return jsonb_build_object('ok', false, 'fehler', 'Kein bestätigtes Konto.'); end if;
  select * into b from gp_backup where uid = u;
  if b.uid is null then return jsonb_build_object('ok', true, 'vorhanden', false); end if;
  return jsonb_build_object('ok', true, 'vorhanden', true, 'zeit', b.updated_at, 'data', b.data);
end $$;

-- Cloud-Sicherung löschen (Konto bleibt)
create or replace function public.gp_sicherung_loeschen() returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  delete from gp_backup where uid = gp_uid();
  return jsonb_build_object('ok', true);
end $$;

-- Nur die Ranglisten-Teilnahme beenden (Konto und Sicherung bleiben)
create or replace function public.gp_rangliste_loeschen() returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  delete from gp_profile where id = gp_uid();
  return jsonb_build_object('ok', true);
end $$;

-- Rechte
do $$ declare f record; begin
  for f in select p.oid::regprocedure as sig, p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
            where n.nspname = 'public' and p.proname in ('gp_ist_konto','gp_sicherung_speichern','gp_sicherung_info',
              'gp_sicherung_laden','gp_sicherung_loeschen','gp_rangliste_loeschen') loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    if f.proname <> 'gp_ist_konto' then
      execute format('grant execute on function %s to authenticated', f.sig);
    end if;
  end loop;
end $$;
