-- GainPilot – Zähler für die Foto-Analyse (einmal im SQL-Editor ausführen)
create table if not exists public.foto_nutzung (
  geraet text not null,
  tag date not null default current_date,
  n int not null default 0,
  primary key (geraet, tag)
);
alter table public.foto_nutzung enable row level security; -- keine Policies: nur der Server kommt dran

create or replace function public.foto_zaehlen(p_geraet text, p_max int, p_gesamt int)
returns boolean language plpgsql security definer set search_path = public as $$
declare v int; summe int;
begin
  select coalesce(sum(n), 0) into summe from foto_nutzung where tag = current_date;
  if summe >= p_gesamt then return false; end if;
  select n into v from foto_nutzung where geraet = p_geraet and tag = current_date;
  if coalesce(v, 0) >= p_max then return false; end if; -- gesperrte Aufrufe zählen nicht mit
  insert into foto_nutzung (geraet, tag, n) values (p_geraet, current_date, 1)
  on conflict (geraet, tag) do update set n = foto_nutzung.n + 1
  returning n into v;
  delete from foto_nutzung where tag < current_date - 7;
  return v <= p_max;
end $$;

revoke all on function public.foto_zaehlen(text, int, int) from public, anon, authenticated;
