-- Gainora Rangliste – einmal im Supabase-SQL-Editor ausführen.
-- Legt zwei Tabellen an, schützt sie mit Row Level Security und
-- erlaubt jedem Nutzer, nur seine eigenen Einträge zu ändern.

-- 1) Spieler: anonyme Anmeldung + frei gewählter Spitzname
create table if not exists public.spieler (
  id          uuid primary key references auth.users(id) on delete cascade,
  spitzname   text not null
              constraint spitzname_format check (spitzname ~ '^[A-Za-z0-9ÄÖÜäöüß_.-]{3,20}$'),
  erstellt    timestamptz not null default now()
);
create unique index if not exists spieler_spitzname_eindeutig on public.spieler (lower(spitzname));

-- 2) Bestwerte: je Spieler, Bereich (spiel/kraft) und Spiel bzw. Übung genau ein Eintrag
create table if not exists public.bestwerte (
  spieler_id   uuid not null references public.spieler(id) on delete cascade,
  art          text not null check (art in ('spiel','kraft')),
  schluessel   text not null check (char_length(schluessel) between 1 and 80),
  wert         numeric not null check (wert > 0),
  einheit      text not null check (einheit in ('punkte','level','sek','kg','wdh')),
  kg           numeric check (kg is null or (kg >= 0 and kg <= 500)),
  wdh          integer check (wdh is null or (wdh between 1 and 3600)),
  datum        date,
  aktualisiert timestamptz not null default now(),
  primary key (spieler_id, art, schluessel),
  -- grobe Plausibilitätsgrenzen gegen offensichtlich gefälschte Werte
  constraint plausibel check (
    (einheit = 'kg'     and wert <= 1000) or
    (einheit = 'wdh'    and wert <= 300)  or
    (einheit = 'sek'    and wert <= 3600) or
    (einheit = 'level'  and wert <= 60)   or
    (einheit = 'punkte' and wert <= 200000)
  )
);
create index if not exists bestwerte_rang on public.bestwerte (art, schluessel, wert desc);

-- Zeitstempel bei jeder Änderung setzen
create or replace function public.bestwerte_zeit() returns trigger language plpgsql as $$
begin new.aktualisiert := now(); return new; end $$;
drop trigger if exists bestwerte_zeit on public.bestwerte;
create trigger bestwerte_zeit before update on public.bestwerte
  for each row execute function public.bestwerte_zeit();

-- Row Level Security
alter table public.spieler   enable row level security;
alter table public.bestwerte enable row level security;

drop policy if exists "alle lesen"        on public.spieler;
drop policy if exists "eigener anlegen"   on public.spieler;
drop policy if exists "eigener aendern"   on public.spieler;
create policy "alle lesen"      on public.spieler for select to anon, authenticated using (true);
create policy "eigener anlegen" on public.spieler for insert to authenticated with check (id = auth.uid());
create policy "eigener aendern" on public.spieler for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "alle lesen"       on public.bestwerte;
drop policy if exists "eigene anlegen"   on public.bestwerte;
drop policy if exists "eigene aendern"   on public.bestwerte;
drop policy if exists "eigene loeschen"  on public.bestwerte;
create policy "alle lesen"      on public.bestwerte for select to anon, authenticated using (true);
create policy "eigene anlegen"  on public.bestwerte for insert to authenticated with check (spieler_id = auth.uid());
create policy "eigene aendern"  on public.bestwerte for update to authenticated using (spieler_id = auth.uid()) with check (spieler_id = auth.uid());
create policy "eigene loeschen" on public.bestwerte for delete to authenticated using (spieler_id = auth.uid());

-- Nur Spitzname lesbar machen, nicht mehr
revoke all on public.spieler from anon, authenticated;
grant select (id, spitzname) on public.spieler to anon, authenticated;
grant insert (id, spitzname), update (spitzname) on public.spieler to authenticated;
revoke all on public.bestwerte from anon;
grant select on public.bestwerte to anon;
grant select, insert, update, delete on public.bestwerte to authenticated;

-- Austreten: löscht die anonyme Anmeldung, Spieler und alle Bestwerte (per cascade)
create or replace function public.rangliste_verlassen() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = auth.uid() and auth.uid() is not null;
$$;
revoke execute on function public.rangliste_verlassen() from public, anon;
grant execute on function public.rangliste_verlassen() to authenticated;

-- Aufräumen: anonyme Anmeldungen, die nie einen Spitznamen bekommen haben, nach 7 Tagen löschen.
-- (Optional: unter Database → Cron als täglichen Job einrichten.)
-- delete from auth.users u where u.is_anonymous and u.created_at < now() - interval '7 days'
--   and not exists (select 1 from public.spieler s where s.id = u.id);
