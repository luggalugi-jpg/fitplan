-- =====================================================================
-- GainPilot – Ranglisten in 4 Stufen
--   1. Kraft- und Lauf-Wertung in deiner Klasse (Geschlecht, Alter, Gewicht)
--   2. Spiele-Saison (monatlich)
--   3. Gesamt-Rating + Monatsliga (Bronze … Diamant)
--   4. Freundesgruppen per Einladungscode
-- Einrichtung: Supabase-Dashboard → SQL Editor → New query →
-- diesen kompletten Text einfügen → Run.
-- Das Skript kann gefahrlos mehrfach ausgeführt werden.
--
-- Grundsatz: Die App greift NIE direkt auf Tabellen zu. Alles läuft über
-- die Funktionen unten (security definer). Punkte, Ligen und Prüfungen
-- gegen Schummeln rechnet nur der Server.
-- =====================================================================

-- ---------- Tabellen ----------
create table if not exists public.gp_profile(
  id uuid primary key references auth.users(id) on delete cascade,
  nick text not null,
  avatar smallint not null default 0 check (avatar between 0 and 31),
  sex text check (sex in ('m','w')),
  age_group text check (age_group in ('u20','20-29','30-39','40-49','50+')),
  bw numeric(5,1) check (bw between 30 and 300),
  league smallint not null default 0 check (league between 0 and 4),   -- 0 Bronze … 4 Diamant
  flagged int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists gp_profile_nick on public.gp_profile (lower(nick));

create table if not exists public.gp_group(
  id bigserial primary key,
  week date not null,
  league smallint not null,
  created_at timestamptz not null default now()
);
create index if not exists gp_group_week on public.gp_group(week, league);

create table if not exists public.gp_member(
  week date not null,
  uid uuid not null references public.gp_profile(id) on delete cascade,
  gid bigint not null references public.gp_group(id) on delete cascade,
  train int not null default 0,
  pr int not null default 0,
  game int not null default 0,
  streak int not null default 0,
  primary key(week, uid)
);
create index if not exists gp_member_gid on public.gp_member(gid);

create table if not exists public.gp_train_day(
  uid uuid not null references public.gp_profile(id) on delete cascade,
  day date not null,
  ex smallint not null,
  complete boolean not null,
  streak smallint not null default 0,
  pts int not null,
  at timestamptz not null default now(),
  primary key(uid, day)
);

create table if not exists public.gp_strength(
  uid uuid not null references public.gp_profile(id) on delete cascade,
  ex text not null,
  e1rm numeric(6,1) not null,
  rel numeric(5,3),
  day date not null,
  at timestamptz not null default now(),
  primary key(uid, ex)
);

create table if not exists public.gp_pr(
  id bigserial primary key,
  uid uuid not null references public.gp_profile(id) on delete cascade,
  ex text not null,
  day date not null,
  e1rm numeric(6,1) not null,
  prev numeric(6,1),
  pts int not null,
  flagged boolean not null default false,
  at timestamptz not null default now()
);
create index if not exists gp_pr_uid_day on public.gp_pr(uid, day);

create table if not exists public.gp_game(
  id bigserial primary key,
  uid uuid not null references public.gp_profile(id) on delete cascade,
  week date not null,
  day date not null,
  game text not null,
  score int not null,
  ref bigint not null,
  dur_s int not null,
  pts int not null,
  flagged boolean not null default false,
  at timestamptz not null default now(),
  unique(uid, ref)
);
create index if not exists gp_game_week on public.gp_game(week, game);

create table if not exists public.gp_week_done(week date primary key, at timestamptz not null default now());

-- Bester Lauf (umgerechnet auf 5 km)
create table if not exists public.gp_run(
  uid uuid primary key references public.gp_profile(id) on delete cascade,
  t5 int not null,              -- Sekunden, auf 5 km umgerechnet (Riegel-Formel)
  km numeric(5,2) not null,
  sec int not null,
  day date not null,
  at timestamptz not null default now()
);

-- Endstand jeder Spiele-Saison (Monat)
create table if not exists public.gp_season(
  month date not null,
  uid uuid not null references public.gp_profile(id) on delete cascade,
  platz int not null,
  anzahl int not null,
  wert int not null,
  primary key(month, uid)
);
create table if not exists public.gp_season_done(month date primary key, at timestamptz not null default now());

-- Freundesgruppen
create table if not exists public.gp_fgroup(
  id bigserial primary key,
  name text not null,
  code text not null unique,
  owner uuid references public.gp_profile(id) on delete set null,
  created_at timestamptz not null default now()
);
create table if not exists public.gp_fmember(
  gid bigint not null references public.gp_fgroup(id) on delete cascade,
  uid uuid not null references public.gp_profile(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key(gid, uid)
);
create index if not exists gp_fmember_uid on public.gp_fmember(uid);
-- Premium (vom Gerät gemeldet; später per RevenueCat-Webhook) und Gruppengröße
alter table public.gp_profile add column if not exists premium boolean not null default false;
alter table public.gp_fgroup add column if not exists maxp int not null default 50;

create table if not exists public.gp_report(
  id bigserial primary key,
  reporter uuid references public.gp_profile(id) on delete set null,
  target uuid not null references public.gp_profile(id) on delete cascade,
  reason text,
  at timestamptz not null default now()
);

-- Kein direkter Zugriff aus der App auf die Tabellen
do $$ declare t text; begin
  foreach t in array array['gp_profile','gp_group','gp_member','gp_train_day','gp_strength','gp_pr','gp_game','gp_week_done','gp_report',
                         'gp_run','gp_season','gp_season_done','gp_fgroup','gp_fmember'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- ---------- Hilfsfunktionen ----------
create or replace function public.gp_today() returns date
language sql stable set search_path = public as
$$ select (now() at time zone 'Europe/Berlin')::date $$;

-- Die Liga läuft monatlich. (Spaltennamen "week" bleiben aus Kompatibilität, sie enthalten den Monatsersten.)
create or replace function public.gp_week(d date default null) returns date
language sql stable set search_path = public as
$$ select date_trunc('month', coalesce(d, public.gp_today()))::date $$;
create or replace function public.gp_monatsende(w date) returns date
language sql immutable set search_path = public as
$$ select (w + interval '1 month' - interval '1 day')::date $$;

create or replace function public.gp_uid() returns uuid
language plpgsql stable set search_path = public as $$
declare u uuid := auth.uid();
begin
  if u is null then raise exception 'nicht angemeldet'; end if;
  return u;
end $$;

create or replace function public.gp_nick_ok(n text) returns boolean
language sql immutable set search_path = public as $$
  select n ~ '^[A-Za-z0-9ÄÖÜäöüß_.-]{3,20}$'
     and not exists (
       select 1 from unnest(array['nazi','hitler','heil','fick','fuck','hure','nutte','wichs','arsch','fotze','schlampe',
         'nigg','neger','kanake','penis','vagina','porn','sex','bitch','admin','gainpilot','moderator','support','offiziell']) w
       where lower(n) like '%' || w || '%')
$$;

create or replace function public.gp_game_pts(g text, s int) returns int
language sql immutable set search_path = public as $$
  select least(40, greatest(0, case g
    when 'numbers' then case when s > 0 then 20 + greatest(0, (60 - s) / 3) else 0 end
    when 'memory'  then s * 6
    when 'tetris'  then s / 40
    else s / 5 end))
$$;

create or replace function public.gp_game_ok(g text, s int) returns boolean
language sql immutable set search_path = public as $$
  select case g
    when 'reaction' then s between 1 and 1500
    when 'stroop'   then s between 1 and 400
    when 'math'     then s between 1 and 400
    when 'wort'     then s between 1 and 400
    when 'memory'   then s between 1 and 30
    when 'tetris'   then s between 1 and 20000
    when 'numbers'  then s between 6 and 300
    else false end
$$;

-- Punkte eines Monats neu zusammenrechnen (Spiele höchstens 25 % der Gesamtpunkte)
create or replace function public.gp_summe(u uuid, w date) returns void
language plpgsql security definer set search_path = public as $$
declare t int; s int; p int; gm int;
begin
  select coalesce(sum(pts),0), coalesce(sum(least(streak,10) * 2),0) into t, s
    from gp_train_day where uid = u and day between w and gp_monatsende(w);
  select coalesce(sum(pts),0) into p from gp_pr where uid = u and day between w and gp_monatsende(w) and not flagged;
  select coalesce(sum(pts),0) into gm from gp_game where uid = u and week = w and not flagged;
  update gp_member set train = t, pr = p, streak = s, game = least(gm, (t + p + s) / 3)
   where week = w and uid = u;
end $$;

-- Monat abschließen: Auf- und Abstieg (wird automatisch beim ersten Aufruf des neuen Monats ausgeführt)
create or replace function public.gp_woche_abschliessen(w date) returns void
language plpgsql security definer set search_path = public as $$
declare g record; n int; up int; dn int;
begin
  if w >= gp_week() then return; end if;
  insert into gp_week_done(week) values (w) on conflict do nothing;
  if not found then return; end if;
  for g in select id from gp_group where week = w loop
    select count(*) into n from gp_member where gid = g.id;
    up := case when n >= 10 then 5 when n >= 3 then 1 else 0 end;
    dn := case when n >= 10 then 5 when n >= 5 then 1 else 0 end;
    with r as (
      select uid, train + pr + game + streak as p,
             row_number() over (order by train + pr + game + streak desc, uid) as rk,
             count(*) over () as c
        from gp_member where gid = g.id)
    update gp_profile pf
       set league = least(4, greatest(0, pf.league +
             case when r.rk <= up and r.p > 0 then 1 when r.rk > r.c - dn then -1 else 0 end))
      from r where pf.id = r.uid;
  end loop;
end $$;

-- Der Monatsgruppe beitreten (max. 30 pro Gruppe, gleiche Liga)
create or replace function public.gp_beitreten() returns bigint
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); w date := gp_week(); lg int; g bigint; x date;
begin
  if not exists (select 1 from gp_profile where id = u) then raise exception 'kein Profil'; end if;
  select gid into g from gp_member where week = w and uid = u;
  if g is not null then return g; end if;
  for x in select distinct gr.week from gp_group gr
            where gr.week < w and not exists (select 1 from gp_week_done d where d.week = gr.week) order by 1 loop
    perform gp_woche_abschliessen(x);
  end loop;
  select league into lg from gp_profile where id = u;
  perform pg_advisory_xact_lock(hashtext('gp_join ' || w::text || ' ' || lg::text));
  select gr.id into g from gp_group gr
   where gr.week = w and gr.league = lg and (select count(*) from gp_member m where m.gid = gr.id) < 30
   order by gr.id limit 1;
  if g is null then insert into gp_group(week, league) values (w, lg) returning id into g; end if;
  insert into gp_member(week, uid, gid) values (w, u, g) on conflict do nothing;
  return g;
end $$;

-- ---------- Funktionen für die App ----------

-- Profil anlegen oder ändern
create or replace function public.gp_profil_speichern(p_nick text, p_avatar int, p_sex text default null, p_age text default null, p_bw numeric default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); n text := btrim(coalesce(p_nick,''));
begin
  if not gp_nick_ok(n) then
    return jsonb_build_object('ok', false, 'fehler', 'Dieser Spitzname geht nicht. Erlaubt sind 3–20 Zeichen: Buchstaben, Zahlen, Punkt, Strich und Unterstrich.');
  end if;
  if exists (select 1 from gp_profile where lower(nick) = lower(n) and id <> u) then
    return jsonb_build_object('ok', false, 'fehler', 'Dieser Spitzname ist schon vergeben.');
  end if;
  insert into gp_profile(id, nick, avatar, sex, age_group, bw)
  values (u, n, greatest(0, least(31, coalesce(p_avatar, 0))),
          case when p_sex in ('m','w') then p_sex end,
          case when p_age in ('u20','20-29','30-39','40-49','50+') then p_age end,
          case when p_bw between 30 and 300 then round(p_bw, 1) end)
  on conflict (id) do update set nick = excluded.nick, avatar = excluded.avatar, sex = excluded.sex,
     age_group = excluded.age_group, bw = excluded.bw, updated_at = now();
  return jsonb_build_object('ok', true);
end $$;

-- Trainingstag melden (Punkte: 10 je erledigter Übung, max. 12, +30 für komplettes Training, Serien-Bonus)
create or replace function public.gp_training(p_day date, p_ex int, p_complete boolean, p_streak int)
returns jsonb language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); w date := gp_week(); e int := least(greatest(coalesce(p_ex,0), 0), 12);
begin
  if p_day is null or p_day > gp_today() or p_day < w then
    return jsonb_build_object('ok', false, 'fehler', 'Nur Trainings des laufenden Monats zählen.');
  end if;
  perform gp_beitreten();
  insert into gp_train_day(uid, day, ex, complete, streak, pts)
  values (u, p_day, e, coalesce(p_complete, false), least(greatest(coalesce(p_streak,0), 0), 60),
          e * 10 + case when coalesce(p_complete, false) and e > 0 then 30 else 0 end)
  on conflict (uid, day) do update set ex = excluded.ex, complete = excluded.complete,
     streak = excluded.streak, pts = excluded.pts, at = now();
  perform gp_summe(u, w);
  return jsonb_build_object('ok', true);
end $$;

-- Bestwert melden (geschätztes 1RM nach Epley; der Server prüft und entscheidet über Punkte)
create or replace function public.gp_bestwert(p_ex text, p_kg numeric, p_reps int, p_bw numeric, p_day date)
returns jsonb language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); w date := gp_week(); e numeric; r numeric; pv gp_strength; pts int := 0; n int;
begin
  if p_day is null or p_day > gp_today() or p_day < w then
    return jsonb_build_object('ok', false, 'fehler', 'Nur Werte des laufenden Monats zählen.');
  end if;
  if length(coalesce(p_ex,'')) not between 2 and 60 or coalesce(p_reps,0) not between 1 and 20
     or coalesce(p_kg,0) <= 0 or p_kg > 500 then
    return jsonb_build_object('ok', false, 'fehler', 'Ungültiger Wert.');
  end if;
  perform gp_beitreten();
  e := round(p_kg * (1 + p_reps / 30.0), 1);
  r := case when p_bw between 30 and 300 then round(e / p_bw, 3) end;
  if e > 600 or coalesce(r, 0) > 5 then
    update gp_profile set flagged = flagged + 1 where id = u;
    return jsonb_build_object('ok', false, 'fehler', 'Dieser Wert ist unrealistisch und wird nicht gewertet.');
  end if;
  select * into pv from gp_strength where uid = u and ex = p_ex;
  if not found then
    insert into gp_strength(uid, ex, e1rm, rel, day) values (u, p_ex, e, r, p_day);
    return jsonb_build_object('ok', true, 'neu', false, 'pts', 0);
  end if;
  if e <= pv.e1rm * 1.005 then
    return jsonb_build_object('ok', true, 'neu', false, 'pts', 0);
  end if;
  -- Sprung über 10 % (und über 5 kg) innerhalb einer Woche: markieren, nicht werten
  if e > pv.e1rm * 1.10 and e - pv.e1rm > 5 and pv.day > p_day - 7 then
    insert into gp_pr(uid, ex, day, e1rm, prev, pts, flagged) values (u, p_ex, p_day, e, pv.e1rm, 0, true);
    update gp_profile set flagged = flagged + 1 where id = u;
    return jsonb_build_object('ok', true, 'neu', false, 'pts', 0, 'geprueft', true,
      'hinweis', 'Der Sprung ist sehr groß und wird erst einmal nicht gewertet.');
  end if;
  select count(*) into n from gp_pr where uid = u and day = p_day and not flagged;
  if n < 3 then pts := 25; end if;
  insert into gp_pr(uid, ex, day, e1rm, prev, pts) values (u, p_ex, p_day, e, pv.e1rm, pts);
  update gp_strength set e1rm = e, rel = coalesce(r, rel), day = p_day, at = now() where uid = u and ex = p_ex;
  perform gp_summe(u, w);
  return jsonb_build_object('ok', true, 'neu', true, 'pts', pts);
end $$;

-- Gewertete Pausenspiel-Runde melden
create or replace function public.gp_spiel(p_game text, p_score int, p_start bigint, p_end bigint)
returns jsonb language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); w date := gp_week(); d date := gp_today(); dur int; fl boolean := false; n int; jetzt bigint;
begin
  if p_game not in ('reaction','memory','numbers','stroop','math','tetris','wort') then
    return jsonb_build_object('ok', false, 'fehler', 'Unbekanntes Spiel.');
  end if;
  jetzt := (extract(epoch from now()) * 1000)::bigint;
  if p_start is null or p_end is null or p_end < p_start or p_end > jetzt + 300000 or p_start < jetzt - 86400000 then
    return jsonb_build_object('ok', false, 'fehler', 'Ungültige Zeitangabe.');
  end if;
  if date_trunc('month', (to_timestamp(p_start / 1000.0) at time zone 'Europe/Berlin'))::date <> w then
    return jsonb_build_object('ok', false, 'fehler', 'Nur Runden des laufenden Monats zählen.');
  end if;
  perform gp_beitreten();
  select count(*) into n from gp_game where uid = u and day = d;
  if n >= 40 then return jsonb_build_object('ok', false, 'fehler', 'Tageslimit für gewertete Runden erreicht.'); end if;
  dur := ((p_end - p_start) / 1000)::int;
  if dur < 5 or dur > 600 or not gp_game_ok(p_game, p_score) then fl := true; end if;
  insert into gp_game(uid, week, day, game, score, ref, dur_s, pts, flagged)
  values (u, w, d, p_game, p_score, p_start, dur, case when fl then 0 else gp_game_pts(p_game, p_score) end, fl)
  on conflict (uid, ref) do nothing;
  if fl then update gp_profile set flagged = flagged + 1 where id = u; end if;
  perform gp_summe(u, w);
  return jsonb_build_object('ok', true, 'geprueft', fl);
end $$;

-- Monatsliga: eigene Gruppe mit Platzierung
create or replace function public.gp_liga() returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); w date := gp_week(); g bigint; lg int; n int; up int; dn int; liste jsonb; ich jsonb;
begin
  if not exists (select 1 from gp_profile where id = u) then return jsonb_build_object('ok', false, 'profil', false); end if;
  g := gp_beitreten();
  select league into lg from gp_group where id = g;
  select count(*) into n from gp_member where gid = g;
  up := case when n >= 10 then 5 when n >= 3 then 1 else 0 end;
  dn := case when n >= 10 then 5 when n >= 5 then 1 else 0 end;
  with r as (
    select m.uid, p.nick, p.avatar, m.train + m.pr + m.game + m.streak as pkt, m.train, m.pr, m.game, m.streak,
           row_number() over (order by m.train + m.pr + m.game + m.streak desc, m.uid) as rk
      from gp_member m join gp_profile p on p.id = m.uid where m.gid = g)
  select jsonb_agg(jsonb_build_object('id', uid, 'nick', nick, 'avatar', avatar, 'pkt', pkt, 'platz', rk, 'ich', uid = u,
           'zone', case when rk <= up and pkt > 0 then 'auf' when rk > n - dn then 'ab' else '' end) order by rk),
         (select jsonb_build_object('platz', rk, 'pkt', pkt, 'training', train, 'bestwerte', pr, 'spiele', game, 'serie', streak)
            from r where uid = u)
    into liste, ich from r;
  return jsonb_build_object('ok', true, 'monat', w, 'bis', gp_monatsende(w), 'liga', lg, 'anzahl', n, 'auf', up, 'ab', dn, 'ich', ich, 'liste', liste);
end $$;

-- (Ranglisten-Funktionen der Stufen 1–4 folgen weiter unten)

-- Verdächtigen Eintrag melden
create or replace function public.gp_melden(p_target uuid, p_grund text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); n int;
begin
  if p_target = u then return jsonb_build_object('ok', false); end if;
  select count(*) into n from gp_report where reporter = u and at > now() - interval '1 day';
  if n >= 10 then return jsonb_build_object('ok', false, 'fehler', 'Zu viele Meldungen heute.'); end if;
  insert into gp_report(reporter, target, reason) values (u, p_target, left(coalesce(p_grund, ''), 200));
  update gp_profile set flagged = flagged + 1 where id = p_target;
  return jsonb_build_object('ok', true);
end $$;

-- Alle eigenen Ranglisten-Daten und das anonyme Konto löschen
create or replace function public.gp_loeschen() returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare u uuid := gp_uid();
begin
  delete from auth.users where id = u;   -- löscht über "on delete cascade" auch alle gp_-Daten
  return jsonb_build_object('ok', true);
end $$;

-- =====================================================================
-- Stufen 1–4
-- =====================================================================

-- Umstellung von Wochen- auf Monatsliga: alte Wochendaten aufräumen (einmalig, danach wirkungslos)
delete from public.gp_group where extract(day from week) <> 1;
delete from public.gp_week_done where extract(day from week) <> 1;
update public.gp_game set week = date_trunc('month', week)::date where extract(day from week) <> 1;
drop function if exists public.gp_kraft(text);
drop function if exists public.gp_spiele(text);

-- ---------- Hilfen ----------
create or replace function public.gp_gewklasse(bw numeric) returns text
language sql immutable set search_path = public as $$
  select case when bw is null then null when bw < 60 then 'bis 60 kg' when bw < 70 then '60–70 kg' when bw < 80 then '70–80 kg'
              when bw < 90 then '80–90 kg' when bw < 100 then '90–100 kg' else 'ab 100 kg' end
$$;

-- Kraft-Wert (0 … 2000): Bankdrücken, Kniebeugen, Kreuzheben, Schulterdrücken im Verhältnis zum Körpergewicht.
-- Je Übung 250 Punkte beim Referenzwert eines fortgeschrittenen Trainierenden, höchstens 500.
create or replace function public.gp_kraft_wert(u uuid) returns int
language sql stable security definer set search_path = public as $$
  select coalesce(round(sum(250 * least(s.rel / r.ref, 2)))::int, 0)
    from gp_strength s join gp_profile p on p.id = s.uid
    join (values ('Bankdrücken', 1.25, 0.75), ('Kniebeugen', 1.6, 1.15), ('Kreuzheben', 2.0, 1.4), ('Schulterdrücken', 0.8, 0.5))
         as r0(ex, m, w) on r0.ex = s.ex
    cross join lateral (select case p.sex when 'm' then r0.m when 'w' then r0.w else (r0.m + r0.w) / 2 end as ref) r
   where s.uid = u and s.rel is not null
$$;

-- Lauf-Wert (0 … 1500): 1000 Punkte bei 5 km in 20:00 (Männer) bzw. 23:00 (Frauen)
create or replace function public.gp_lauf_wert(u uuid) returns int
language sql stable security definer set search_path = public as $$
  select coalesce((select least(1500, round(1000 * power(
           (case p.sex when 'm' then 1200 when 'w' then 1380 else 1290 end)::numeric / r.t5, 2)))::int
         from gp_run r join gp_profile p on p.id = r.uid where r.uid = u), 0)
$$;

-- Spiele-Wert einer Saison (0 … 1000): bestes Ergebnis je Spiel, 7 Spiele
create or replace function public.gp_spiele_wert(u uuid, m date) returns int
language sql stable security definer set search_path = public as $$
  select coalesce(round(sum(b) * 1000.0 / 280)::int, 0)
    from (select max(pts) as b from gp_game where uid = u and week = m and not flagged group by game) x
$$;

-- Fleiß (0 … 800): Trainingstage der letzten 30 Tage, höchstens 20
create or replace function public.gp_fleiss_wert(u uuid) returns int
language sql stable security definer set search_path = public as $$
  select least(20, count(*))::int * 40 from gp_train_day where uid = u and ex > 0 and day > gp_today() - 30
$$;

create or replace function public.gp_rang(g int) returns text
language sql immutable set search_path = public as $$
  select case when g >= 3200 then 'Legende' when g >= 2400 then 'Champion' when g >= 1700 then 'Elite'
              when g >= 1000 then 'Athlet' when g >= 400 then 'Aufsteiger' else 'Rookie' end
$$;

-- Alle Werte eines Nutzers (für Listen)
create or replace function public.gp_werte(u uuid) returns table(kraft int, lauf int, spiele int, fleiss int, gesamt int)
language sql stable security definer set search_path = public as $$
  select k, l, s, f, k + l + s + f from (select gp_kraft_wert(u) k, gp_lauf_wert(u) l, gp_spiele_wert(u, gp_week()) s, gp_fleiss_wert(u) f) x
$$;

-- Spiele-Saison abschließen (beim ersten Aufruf im neuen Monat)
create or replace function public.gp_saison_abschliessen() returns void
language plpgsql security definer set search_path = public as $$
declare m date;
begin
  for m in select distinct week from gp_game where week < gp_week()
            and not exists (select 1 from gp_season_done d where d.month = gp_game.week) order by 1 loop
    insert into gp_season_done(month) values (m) on conflict do nothing;
    if not found then continue; end if;
    with w as (select uid, gp_spiele_wert(uid, m) as v from (select distinct uid from gp_game where week = m and not flagged) q),
         r as (select uid, v, row_number() over (order by v desc, uid) as rk, count(*) over () as n from w where v > 0)
    insert into gp_season(month, uid, platz, anzahl, wert) select m, uid, rk, n, v from r on conflict do nothing;
  end loop;
end $$;

-- ---------- Stufe 1: Kraft & Lauf ----------

-- Lauf melden (der beste Lauf zählt, umgerechnet auf 5 km)
create or replace function public.gp_lauf(p_km numeric, p_sec int, p_day date)
returns jsonb language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); t int; alt gp_run;
begin
  if not exists (select 1 from gp_profile where id = u) then return jsonb_build_object('ok', false, 'profil', false); end if;
  if p_day is null or p_day > gp_today() or p_day < gp_today() - 60 then
    return jsonb_build_object('ok', false, 'fehler', 'Nur Läufe der letzten 60 Tage zählen.');
  end if;
  if coalesce(p_km, 0) < 3 or p_km > 60 or coalesce(p_sec, 0) <= 0 then
    return jsonb_build_object('ok', false, 'fehler', 'Für die Wertung zählen Läufe ab 3 km.');
  end if;
  if p_sec / p_km < 150 or p_sec / p_km > 900 then
    update gp_profile set flagged = flagged + 1 where id = u;
    return jsonb_build_object('ok', false, 'fehler', 'Dieses Tempo ist unrealistisch und wird nicht gewertet.');
  end if;
  t := round(p_sec * power(5.0 / p_km, 1.06));
  select * into alt from gp_run where uid = u;
  if found and alt.t5 <= t then return jsonb_build_object('ok', true, 'neu', false); end if;
  insert into gp_run(uid, t5, km, sec, day) values (u, t, round(p_km, 2), p_sec, p_day)
  on conflict (uid) do update set t5 = excluded.t5, km = excluded.km, sec = excluded.sec, day = excluded.day, at = now();
  return jsonb_build_object('ok', true, 'neu', true, 't5', t);
end $$;

-- Kraft- und Lauf-Wertung: eigene Werte, Platz in der Klasse (oder in allen) und Top 20
create or replace function public.gp_kraftlauf(p_alle boolean default false) returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); me gp_profile; mk int; ml int; kl jsonb; ll jsonb; kp int; lp int; kn int; ln int; lifts jsonb; lauf jsonb;
begin
  select * into me from gp_profile where id = u;
  if not found then return jsonb_build_object('ok', false, 'profil', false); end if;
  mk := gp_kraft_wert(u); ml := gp_lauf_wert(u);
  create temp table if not exists gp_tmp_kl(uid uuid, nick text, avatar int, k int, l int) on commit drop;
  delete from gp_tmp_kl;
  insert into gp_tmp_kl
    select p.id, p.nick, p.avatar, gp_kraft_wert(p.id), gp_lauf_wert(p.id) from gp_profile p
     where coalesce(p_alle, false)
        or ((me.sex is null or p.sex = me.sex) and (me.age_group is null or p.age_group = me.age_group)
            and (me.bw is null or gp_gewklasse(p.bw) = gp_gewklasse(me.bw)));
  select count(*) filter (where x.k > 0), count(*) filter (where x.k > mk) + 1, count(*) filter (where x.l > 0), count(*) filter (where x.l > ml) + 1
    into kn, kp, ln, lp from gp_tmp_kl x;
  select coalesce(jsonb_agg(jsonb_build_object('id', uid, 'nick', nick, 'avatar', avatar, 'wert', k, 'ich', uid = u) order by k desc), '[]')
    into kl from (select * from gp_tmp_kl where k > 0 order by k desc, uid limit 20) a;
  select coalesce(jsonb_agg(jsonb_build_object('id', uid, 'nick', nick, 'avatar', avatar, 'wert', l, 'ich', uid = u) order by l desc), '[]')
    into ll from (select * from gp_tmp_kl where l > 0 order by l desc, uid limit 20) a;
  select coalesce(jsonb_object_agg(ex, jsonb_build_object('e1rm', e1rm, 'rel', rel)), '{}') into lifts
    from gp_strength where uid = u and ex in ('Bankdrücken','Kniebeugen','Kreuzheben','Schulterdrücken');
  select jsonb_build_object('t5', t5, 'km', km, 'sec', sec, 'tag', day) into lauf from gp_run where uid = u;
  return jsonb_build_object('ok', true, 'alle', coalesce(p_alle, false),
    'klasse', jsonb_build_object('sex', me.sex, 'alter', me.age_group, 'gewicht', gp_gewklasse(me.bw)),
    'kraft', jsonb_build_object('wert', mk, 'platz', case when mk > 0 then kp end, 'anzahl', kn, 'lifts', lifts, 'liste', kl),
    'lauf', jsonb_build_object('wert', ml, 'platz', case when ml > 0 then lp end, 'anzahl', ln, 'bester', lauf, 'liste', ll));
end $$;

-- ---------- Stufe 2: Spiele-Saison (Monat) ----------
create or replace function public.gp_saison() returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); m date := gp_week(); mv int; pl int; n int; liste jsonb; je jsonb; letzte jsonb; titel int;
begin
  if not exists (select 1 from gp_profile where id = u) then return jsonb_build_object('ok', false, 'profil', false); end if;
  perform gp_saison_abschliessen();
  mv := gp_spiele_wert(u, m);
  with w as (select uid, gp_spiele_wert(uid, m) as v from (select distinct uid from gp_game where week = m and not flagged) q)
  select count(*) filter (where w.v > 0), count(*) filter (where w.v > mv) + 1 into n, pl from w;
  with w as (select uid, gp_spiele_wert(uid, m) as v from (select distinct uid from gp_game where week = m and not flagged) q)
  select coalesce(jsonb_agg(jsonb_build_object('id', a.uid, 'nick', p.nick, 'avatar', p.avatar, 'wert', a.v, 'ich', a.uid = u) order by a.v desc), '[]')
    into liste from (select * from w where v > 0 order by v desc, uid limit 20) a join gp_profile p on p.id = a.uid;
  select coalesce(jsonb_object_agg(game, jsonb_build_object('best', case when game = 'numbers' then mn else mx end, 'pkt', pk)), '{}') into je
    from (select game, max(score) mx, min(score) mn, max(pts) pk from gp_game where uid = u and week = m and not flagged group by game) x;
  select jsonb_build_object('monat', month, 'platz', platz, 'anzahl', anzahl, 'wert', wert) into letzte
    from gp_season where uid = u order by month desc limit 1;
  select count(*) into titel from gp_season where uid = u and platz <= 3;
  return jsonb_build_object('ok', true, 'monat', m, 'bis', gp_monatsende(m), 'wert', mv, 'platz', case when mv > 0 then pl end,
    'anzahl', n, 'spiele', je, 'liste', liste, 'letzte', letzte, 'podest', titel);
end $$;

-- ---------- Stufe 3: Gesamt-Rating (die Monatsliga liefert gp_liga) ----------
create or replace function public.gp_gesamt() returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); me record; pl int; n int; liste jsonb;
begin
  if not exists (select 1 from gp_profile where id = u) then return jsonb_build_object('ok', false, 'profil', false); end if;
  select * into me from gp_werte(u);
  create temp table if not exists gp_tmp_g(uid uuid, g int) on commit drop;
  delete from gp_tmp_g;
  insert into gp_tmp_g select p.id, (select w.gesamt from gp_werte(p.id) w) from gp_profile p;
  select count(*) filter (where g > 0), count(*) filter (where g > me.gesamt) + 1 into n, pl from gp_tmp_g;
  select coalesce(jsonb_agg(jsonb_build_object('id', a.uid, 'nick', p.nick, 'avatar', p.avatar, 'wert', a.g, 'rang', gp_rang(a.g), 'ich', a.uid = u) order by a.g desc), '[]')
    into liste from (select * from gp_tmp_g where g > 0 order by g desc, uid limit 20) a join gp_profile p on p.id = a.uid;
  return jsonb_build_object('ok', true, 'kraft', me.kraft, 'lauf', me.lauf, 'spiele', me.spiele, 'fleiss', me.fleiss,
    'gesamt', me.gesamt, 'rang', gp_rang(me.gesamt), 'platz', case when me.gesamt > 0 then pl end, 'anzahl', n, 'liste', liste,
    'stufen', jsonb_build_array(jsonb_build_object('n','Rookie','ab',0), jsonb_build_object('n','Aufsteiger','ab',400),
      jsonb_build_object('n','Athlet','ab',1000), jsonb_build_object('n','Elite','ab',1700),
      jsonb_build_object('n','Champion','ab',2400), jsonb_build_object('n','Legende','ab',3200)));
end $$;

-- ---------- Stufe 4: Freundesgruppen ----------
create or replace function public.gp_gruppenname_ok(n text) returns boolean
language sql immutable set search_path = public as $$
  select n ~ '^[A-Za-z0-9ÄÖÜäöüß _.!-]{3,30}$' and gp_nick_ok(regexp_replace(n, '[ !]', '_', 'g'))
$$;

create or replace function public.gp_gruppe_erstellen(p_name text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); n text := btrim(regexp_replace(coalesce(p_name, ''), '\s+', ' ', 'g')); c text; g bigint; i int := 0;
begin
  if not exists (select 1 from gp_profile where id = u) then return jsonb_build_object('ok', false, 'profil', false); end if;
  if not gp_gruppenname_ok(n) then
    return jsonb_build_object('ok', false, 'fehler', 'Der Name geht nicht. Erlaubt sind 3–30 Zeichen: Buchstaben, Zahlen, Leerzeichen und . _ - !');
  end if;
  if (select count(*) from gp_fmember where uid = u) >= 10 then
    return jsonb_build_object('ok', false, 'fehler', 'Du bist schon in 10 Gruppen – mehr geht nicht.');
  end if;
  if (select count(*) from gp_fgroup where owner = u and created_at > now() - interval '1 day') >= 5 then
    return jsonb_build_object('ok', false, 'fehler', 'Heute kannst du keine weitere Gruppe erstellen.');
  end if;
  loop
    select string_agg(substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 1 + floor(random() * 31)::int, 1), '') into c from generate_series(1, 6);
    exit when not exists (select 1 from gp_fgroup where code = c);
    i := i + 1; if i > 20 then raise exception 'kein Code'; end if;
  end loop;
  insert into gp_fgroup(name, code, owner, maxp)
    values (n, c, u, case when (select premium from gp_profile where id = u) then 50 else 3 end) returning id into g;
  insert into gp_fmember(gid, uid) values (g, u);
  return jsonb_build_object('ok', true, 'id', g, 'code', c, 'name', n);
end $$;

-- Premium-Status melden: setzt die Größe der eigenen Gruppen (Free 3, Premium 50; bestehende Mitglieder bleiben)
create or replace function public.gp_premium_melden(p_aktiv boolean) returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid();
begin
  update gp_profile set premium = coalesce(p_aktiv, false) where id = u;
  if not found then return jsonb_build_object('ok', false, 'profil', false); end if;
  update gp_fgroup set maxp = case when coalesce(p_aktiv, false) then 50 else 3 end where owner = u;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.gp_gruppe_beitreten(p_code text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); gr gp_fgroup; n int;
begin
  if not exists (select 1 from gp_profile where id = u) then return jsonb_build_object('ok', false, 'profil', false); end if;
  select * into gr from gp_fgroup where code = upper(btrim(coalesce(p_code, '')));
  if not found then return jsonb_build_object('ok', false, 'fehler', 'Diesen Einladungscode gibt es nicht.'); end if;
  if exists (select 1 from gp_fmember where gid = gr.id and uid = u) then
    return jsonb_build_object('ok', true, 'id', gr.id, 'name', gr.name, 'schon', true);
  end if;
  if (select count(*) from gp_fmember where uid = u) >= 10 then
    return jsonb_build_object('ok', false, 'fehler', 'Du bist schon in 10 Gruppen – mehr geht nicht.');
  end if;
  perform pg_advisory_xact_lock(hashtext('gp_fg ' || gr.id));
  select count(*) into n from gp_fmember where gid = gr.id;
  if n >= least(gr.maxp, 50) then
    return jsonb_build_object('ok', false, 'fehler', case when gr.maxp < 50
      then 'Die Gruppe ist voll (' || gr.maxp || ' Personen). Wer sie erstellt hat, kann sie mit Premium vergrößern.'
      else 'Die Gruppe ist voll (50 Personen).' end);
  end if;
  insert into gp_fmember(gid, uid) values (gr.id, u) on conflict do nothing;
  return jsonb_build_object('ok', true, 'id', gr.id, 'name', gr.name);
end $$;

create or replace function public.gp_gruppe_verlassen(p_gid bigint) returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); neu uuid;
begin
  delete from gp_fmember where gid = p_gid and uid = u;
  if (select owner from gp_fgroup where id = p_gid) = u then
    select uid into neu from gp_fmember where gid = p_gid order by joined_at limit 1;
    if neu is null then delete from gp_fgroup where id = p_gid;
    else update gp_fgroup set owner = neu where id = p_gid; end if;
  elsif not exists (select 1 from gp_fmember where gid = p_gid) then
    delete from gp_fgroup where id = p_gid;
  end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.gp_gruppe_entfernen(p_gid bigint, p_uid uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid();
begin
  if (select owner from gp_fgroup where id = p_gid) is distinct from u or p_uid = u then
    return jsonb_build_object('ok', false, 'fehler', 'Nur wer die Gruppe erstellt hat, kann andere entfernen.');
  end if;
  delete from gp_fmember where gid = p_gid and uid = p_uid;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.gp_gruppen() returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); r jsonb;
begin
  if not exists (select 1 from gp_profile where id = u) then return jsonb_build_object('ok', false, 'profil', false); end if;
  select coalesce(jsonb_agg(jsonb_build_object('id', g.id, 'name', g.name, 'code', g.code, 'admin', g.owner = u,
           'anzahl', (select count(*) from gp_fmember x where x.gid = g.id)) order by m.joined_at), '[]')
    into r from gp_fmember m join gp_fgroup g on g.id = m.gid where m.uid = u;
  return jsonb_build_object('ok', true, 'gruppen', r);
end $$;

-- Eine Gruppe mit allen Wertungen ihrer Mitglieder
create or replace function public.gp_gruppe(p_gid bigint) returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); gr gp_fgroup; r jsonb; mo date := gp_week();
begin
  select * into gr from gp_fgroup where id = p_gid;
  if not found or not exists (select 1 from gp_fmember where gid = p_gid and uid = u) then
    return jsonb_build_object('ok', false, 'fehler', 'Du bist nicht in dieser Gruppe.');
  end if;
  select coalesce(jsonb_agg(jsonb_build_object('id', m.uid, 'nick', p.nick, 'avatar', p.avatar, 'ich', m.uid = u, 'admin', gr.owner = m.uid,
           'kraft', w.kraft, 'lauf', w.lauf, 'spiele', w.spiele, 'fleiss', w.fleiss, 'gesamt', w.gesamt, 'rang', gp_rang(w.gesamt),
           'liga', p.league, 'monat', coalesce((select mm.train + mm.pr + mm.game + mm.streak from gp_member mm where mm.week = mo and mm.uid = m.uid), 0))), '[]')
    into r from gp_fmember m join gp_profile p on p.id = m.uid cross join lateral gp_werte(m.uid) w where m.gid = p_gid;
  return jsonb_build_object('ok', true, 'id', gr.id, 'name', gr.name, 'code', gr.code, 'admin', gr.owner = u, 'max', gr.maxp, 'mitglieder', r);
end $$;

-- ---------- Rechte: nur angemeldete Nutzer (auch anonyme) dürfen die App-Funktionen aufrufen ----------
do $$ declare f record; begin
  for f in select p.oid::regprocedure as sig, p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
            where n.nspname = 'public' and p.proname like 'gp\_%' loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    if f.proname in ('gp_profil_speichern','gp_training','gp_bestwert','gp_spiel','gp_liga','gp_melden','gp_loeschen',
                     'gp_lauf','gp_kraftlauf','gp_saison','gp_gesamt','gp_gruppe_erstellen','gp_gruppe_beitreten','gp_gruppe_verlassen',
                     'gp_gruppe_entfernen','gp_gruppen','gp_gruppe','gp_premium_melden',
                     'gp_sicherung_speichern','gp_sicherung_info','gp_sicherung_laden','gp_sicherung_loeschen','gp_rangliste_loeschen') then
      execute format('grant execute on function %s to authenticated', f.sig);
    end if;
  end loop;
end $$;

-- Gesperrte Spitznamen: Nutzer mit sehr vielen Auffälligkeiten erscheinen weiter, können aber per
-- "update public.gp_profile set league = 0 where …" oder Löschen manuell behandelt werden.
-- Meldungen ansehen:  select r.*, p.nick from public.gp_report r join public.gp_profile p on p.id = r.target order by r.at desc;
