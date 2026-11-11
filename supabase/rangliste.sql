-- =====================================================================
-- GainPilot – Rangliste (Wochenliga, Kraft, Pausenspiele)
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

create table if not exists public.gp_report(
  id bigserial primary key,
  reporter uuid references public.gp_profile(id) on delete set null,
  target uuid not null references public.gp_profile(id) on delete cascade,
  reason text,
  at timestamptz not null default now()
);

-- Kein direkter Zugriff aus der App auf die Tabellen
do $$ declare t text; begin
  foreach t in array array['gp_profile','gp_group','gp_member','gp_train_day','gp_strength','gp_pr','gp_game','gp_week_done','gp_report'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- ---------- Hilfsfunktionen ----------
create or replace function public.gp_today() returns date
language sql stable set search_path = public as
$$ select (now() at time zone 'Europe/Berlin')::date $$;

create or replace function public.gp_week(d date default null) returns date
language sql stable set search_path = public as
$$ select date_trunc('week', coalesce(d, public.gp_today()))::date $$;

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

-- Punkte einer Woche neu zusammenrechnen (Spiele höchstens 25 % der Gesamtpunkte)
create or replace function public.gp_summe(u uuid, w date) returns void
language plpgsql security definer set search_path = public as $$
declare t int; s int; p int; gm int;
begin
  select coalesce(sum(pts),0), coalesce(sum(least(streak,10) * 2),0) into t, s
    from gp_train_day where uid = u and day between w and w + 6;
  select coalesce(sum(pts),0) into p from gp_pr where uid = u and day between w and w + 6 and not flagged;
  select coalesce(sum(pts),0) into gm from gp_game where uid = u and week = w and not flagged;
  update gp_member set train = t, pr = p, streak = s, game = least(gm, (t + p + s) / 3)
   where week = w and uid = u;
end $$;

-- Woche abschließen: Auf- und Abstieg (wird automatisch beim ersten Aufruf der neuen Woche ausgeführt)
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

-- Der Wochengruppe beitreten (max. 30 pro Gruppe, gleiche Liga)
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
    return jsonb_build_object('ok', false, 'fehler', 'Nur Trainings der laufenden Woche zählen.');
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
    return jsonb_build_object('ok', false, 'fehler', 'Nur Werte der laufenden Woche zählen.');
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
  if date_trunc('week', (to_timestamp(p_start / 1000.0) at time zone 'Europe/Berlin'))::date <> w then
    return jsonb_build_object('ok', false, 'fehler', 'Nur Runden der laufenden Woche zählen.');
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

-- Wochenliga: eigene Gruppe mit Platzierung
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
  return jsonb_build_object('ok', true, 'woche', w, 'liga', lg, 'anzahl', n, 'auf', up, 'ab', dn, 'ich', ich, 'liste', liste);
end $$;

-- Kraft-Rangliste je Übung: Perzentil in der Vergleichsgruppe und Top 10
create or replace function public.gp_kraft(p_ex text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); me gp_profile; mine gp_strength; wert numeric; anz int; unter int; top jsonb; ueb jsonb;
  wk text;
begin
  select * into me from gp_profile where id = u;
  if not found then return jsonb_build_object('ok', false, 'profil', false); end if;
  select coalesce(jsonb_agg(ex order by ex), '[]'::jsonb) into ueb from gp_strength where uid = u;
  select * into mine from gp_strength where uid = u and ex = p_ex;
  wk := case when me.bw is null then null when me.bw < 60 then '<60' when me.bw < 70 then '60' when me.bw < 80 then '70'
             when me.bw < 90 then '80' when me.bw < 100 then '90' else '100+' end;
  if mine.uid is not null then
    wert := coalesce(mine.rel, mine.e1rm);
    with v as (
      select coalesce(s.rel, s.e1rm) as x from gp_strength s join gp_profile p on p.id = s.uid
       where s.ex = p_ex and (mine.rel is null) = (s.rel is null)
         and (me.sex is null or p.sex = me.sex) and (me.age_group is null or p.age_group = me.age_group)
         and (wk is null or case when p.bw is null then null when p.bw < 60 then '<60' when p.bw < 70 then '60' when p.bw < 80 then '70'
                                 when p.bw < 90 then '80' when p.bw < 100 then '90' else '100+' end = wk))
    select count(*), count(*) filter (where x < wert) into anz, unter from v;
  end if;
  select coalesce(jsonb_agg(jsonb_build_object('id', t.uid, 'nick', t.nick, 'avatar', t.avatar, 'e1rm', t.e1rm, 'rel', t.rel, 'ich', t.uid = u) order by t.e1rm desc), '[]'::jsonb)
    into top
    from (select s.uid, p.nick, p.avatar, s.e1rm, s.rel from gp_strength s join gp_profile p on p.id = s.uid
           where s.ex = p_ex order by s.e1rm desc limit 10) t;
  return jsonb_build_object('ok', true, 'uebungen', ueb, 'e1rm', mine.e1rm, 'rel', mine.rel,
    'vergleich', anz, 'perzentil', case when anz > 1 then round(100.0 * unter / (anz - 1)) end, 'top', top);
end $$;

-- Pausenspiel-Bestenliste der eigenen Liga-Gruppe (laufende Woche)
create or replace function public.gp_spiele(p_game text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := gp_uid(); w date := gp_week(); g bigint; liste jsonb; tief boolean := p_game = 'numbers';
begin
  if not exists (select 1 from gp_profile where id = u) then return jsonb_build_object('ok', false, 'profil', false); end if;
  g := gp_beitreten();
  with b as (
    select gg.uid, case when tief then min(gg.score) else max(gg.score) end as best
      from gp_game gg join gp_member m on m.uid = gg.uid and m.week = w and m.gid = g
     where gg.week = w and gg.game = p_game and not gg.flagged group by gg.uid)
  select coalesce(jsonb_agg(jsonb_build_object('id', b.uid, 'nick', p.nick, 'avatar', p.avatar, 'wert', b.best, 'ich', b.uid = u)
           order by case when tief then b.best else -b.best end), '[]'::jsonb)
    into liste from b join gp_profile p on p.id = b.uid;
  return jsonb_build_object('ok', true, 'spiel', p_game, 'liste', liste);
end $$;

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

-- ---------- Rechte: nur angemeldete Nutzer (auch anonyme) dürfen die App-Funktionen aufrufen ----------
do $$ declare f record; begin
  for f in select p.oid::regprocedure as sig, p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
            where n.nspname = 'public' and p.proname like 'gp\_%' loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    if f.proname in ('gp_profil_speichern','gp_training','gp_bestwert','gp_spiel','gp_liga','gp_kraft','gp_spiele','gp_melden','gp_loeschen',
                     'gp_sicherung_speichern','gp_sicherung_info','gp_sicherung_laden','gp_sicherung_loeschen','gp_rangliste_loeschen') then
      execute format('grant execute on function %s to authenticated', f.sig);
    end if;
  end loop;
end $$;

-- Gesperrte Spitznamen: Nutzer mit sehr vielen Auffälligkeiten erscheinen weiter, können aber per
-- "update public.gp_profile set league = 0 where …" oder Löschen manuell behandelt werden.
-- Meldungen ansehen:  select r.*, p.nick from public.gp_report r join public.gp_profile p on p.id = r.target order by r.at desc;
