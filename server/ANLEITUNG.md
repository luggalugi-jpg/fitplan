# Rangliste einrichten (Supabase)

Die Rangliste braucht einen kleinen Server. Dafür nutzt Gainora **Supabase** (kostenloser Tarif reicht für den Anfang). Solange die beiden Werte in der App leer sind, ist die Rangliste einfach ausgeblendet – die App funktioniert wie bisher.

## 1. Projekt anlegen
1. Auf https://supabase.com mit deinem GitHub-Konto anmelden.
2. **New project** → Name `gainora`, Datenbank-Passwort sicher notieren, **Region: Central EU (Frankfurt)**.

## 2. Anonyme Anmeldung einschalten
**Authentication → Sign In / Providers → „Allow anonymous sign-ins“** einschalten und speichern.
(Empfohlen für später: unter *Attack Protection* ein CAPTCHA aktivieren, falls Spam-Anmeldungen auftauchen.)

## 3. Tabellen anlegen
**SQL Editor → New query**, den kompletten Inhalt von `server/supabase.sql` einfügen und **Run** drücken. Es sollte „Success“ erscheinen.

## 4. Schlüssel in die App eintragen
**Project Settings → API** (bzw. *Data API* und *API Keys*):
- **Project URL**, z. B. `https://abcdefgh.supabase.co`
- **anon / publishable key** (der *öffentliche* Schlüssel – **niemals** den `service_role`/secret key!)

In `essensplan.html` ganz oben im Abschnitt „Rangliste“:
```js
const RL_URL="https://abcdefgh.supabase.co";
const RL_KEY="eyJhbGciOi...";
```
Der öffentliche Schlüssel darf in der App stehen; geschützt wird alles durch die Regeln (Row Level Security) aus Schritt 3.

## 5. Hochladen
`essensplan.html`, `datenschutz.html` und `sw.js` ins GitHub-Repo hochladen. Für die Store-App danach wie gewohnt neu bauen.

## 6. Rechtliches erledigen
- Im Supabase-Dashboard unter **Organization → Legal Documents** den **Auftragsverarbeitungsvertrag (DPA)** abschließen.
- Die Anschrift von Supabase in der Datenschutzerklärung mit dem DPA abgleichen.
- Store-Angaben anpassen: siehe `store/datensicherheit.md`.

## Moderation
Gemeldete Spitznamen kommen per E-Mail an gainora.app@gmail.com. Löschen: **Table Editor → spieler** → Zeile löschen (die Bestwerte verschwinden automatisch mit).

## Wie die Wertung funktioniert
- **Pausenspiele:** Es zählen nur Runden, die während einer laufenden Satzpause gestartet wurden. Bester Wert je Spiel (bei Number Blitz die kürzeste Zeit).
- **Kraft:** Jede Übung aus der App-Übungsliste hat eine eigene Rangliste. Gewichtsübungen nach geschätztem 1RM = Gewicht × (1 + Wdh/30) aus dem besten Satz; Körpergewichtsübungen nach Wiederholungen; Halteübungen nach Sekunden. Selbst angelegte Übungen werden nicht übertragen (deren Namen könnte man sonst frei wählen).
- Die Datenbank lehnt unrealistische Werte ab (z. B. über 1000 kg 1RM).
