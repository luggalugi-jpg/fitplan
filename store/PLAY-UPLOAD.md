# GainPilot in die Play Console hochladen – Schritt für Schritt

Stand: 18.11.2026 · App-Version 3.72 · versionCode 6

Alle Texte zum Kopieren stehen in `texte-de.md`, die Antworten zur Datensicherheit in `datensicherheit.md`.
Bilder: `grafiken/` (Icon, Feature-Grafik) und `screenshots/android/` (8 Screenshots).

---

## 1 · App-Paket herunterladen

1. Öffne https://github.com/luggalugi-jpg/fitplan/actions und klicke auf den neuesten Lauf **„2 · Android-App bauen“** (grüner Haken).
2. Unten bei **Artifacts** auf **gainpilot-android-6** klicken. Es lädt eine ZIP-Datei.
3. ZIP entpacken. Darin liegt **app-release.aab** – das ist die Datei für Google Play.

## 2 · App anlegen

Play Console → **Alle Apps → App erstellen**

| Feld | Eingabe |
|---|---|
| App-Name | `GainPilot: Essen & Training` |
| Standardsprache | Deutsch – de-DE |
| App oder Spiel | App |
| Kostenlos oder kostenpflichtig | Kostenlos (Premium läuft später als In-App-Abo – das geht auch bei kostenlosen Apps) |
| Erklärungen | Beide Häkchen setzen |

## 3 · App einrichten (Dashboard → „App einrichten“)

Die Punkte unter **„Informationen zur App angeben“** nacheinander erledigen:

| Punkt | Antwort |
|---|---|
| **Datenschutzerklärung** | `https://luggalugi-jpg.github.io/fitplan/datenschutz.html` |
| **App-Zugriff** | „Alle Funktionen sind ohne besondere Zugriffsrechte verfügbar“. Unter Hinweise den Text aus `texte-de.md` (App-Zugriff für Prüfer) einfügen. |
| **Werbung** | Nein, keine Werbung |
| **Einstufung des Inhalts** | Kategorie „Alle anderen App-Typen“. Gewalt, Sexualität, Drogen, Glücksspiel: alles **Nein**. **Nutzer können interagieren oder Inhalte austauschen: Ja** (Spitznamen in Rangliste und Gruppen). **Standort wird mit anderen Nutzern geteilt: Nein**. **Digitale Käufe: Ja**. |
| **Zielgruppe** | Altersgruppen **16–17** und **18 und älter**. „Spricht die App Kinder an?“ – Nein. |
| **Nachrichten-App** | Nein |
| **COVID-19 / Behörden-App** | Nein |
| **Finanzfunktionen** | Keine |
| **Gesundheit** | Fitness und Ernährung ankreuzen. Kein Medizinprodukt, keine Forschung. |
| **Datensicherheit** | Genau nach `datensicherheit.md` ausfüllen (inkl. „Genauer Standort“ für die Studio-Rangliste). Am Ende **„Konto löschen“-URL**: `https://luggalugi-jpg.github.io/fitplan/datenschutz.html#loeschen` |
| **Werbe-ID** | Nein, die App nutzt keine Werbe-ID |

## 4 · Store-Eintrag (Wachstum → Store-Präsenz → Haupteintrag)

| Feld | Inhalt |
|---|---|
| App-Name | aus `texte-de.md` |
| Kurzbeschreibung | aus `texte-de.md` (80 Zeichen) |
| Vollständige Beschreibung | aus `texte-de.md` |
| App-Symbol | `grafiken/play-icon-512.png` |
| Feature-Grafik | `grafiken/feature-graphic-1024x500.png` |
| Screenshots Smartphone | alle 8 aus `screenshots/android/` in der Reihenfolge 1–8 |
| Kategorie | Gesundheit und Fitness |
| Tags | Fitness, Ernährung, Krafttraining, Laufen |
| Kontakt-E-Mail | gainpilot.app@gmail.com |
| Website | `https://luggalugi-jpg.github.io/fitplan/` (optional) |

## 5 · Geschlossener Test starten (Pflicht für neue private Konten)

1. **Testen → Geschlossene Tests → Track „Closed testing – Alpha“ → Tester**: E-Mail-Liste anlegen, mindestens **12 Google-Konten** eintragen (besser 15–20 als Puffer). Speichern.
2. **Release erstellen** → bei „Play App-Signatur“ **Weiter / Google verwaltet den Schlüssel** bestätigen.
3. **app-release.aab** hochladen. Versionsname erscheint als **3.72.0 (6)**.
4. Versionshinweise: Text „Neuigkeiten dieser Version“ aus `texte-de.md`.
5. **Länder**: Deutschland, Österreich, Schweiz (später erweiterbar).
6. **Überprüfen und Einführung starten**. Google prüft die App (meist 1–3 Tage, beim ersten Mal manchmal bis 7).
7. Nach der Freigabe: unter **Tester** den **Link zum Teilnehmen** kopieren und an alle Tester schicken. Jeder muss
   - den Link öffnen und auf **„Tester werden“** tippen,
   - die App aus dem Play Store installieren,
   - **14 Tage am Stück** Tester bleiben (nicht austreten!).

## 6 · Produktionszugriff beantragen

Nach **14 Tagen mit mindestens 12 Testern** erscheint im Dashboard **„Zugriff auf Produktion beantragen“**. Fragen ehrlich beantworten
(wie getestet wurde, welches Feedback kam, was geändert wurde). Danach Produktions-Release mit derselben oder neuerer .aab erstellen.

## Wichtig

- Die App-Kennung **de.preikschas.gainpilot** lässt sich nach dem ersten Upload nie mehr ändern.
- Jede neue .aab braucht einen höheren versionCode – das macht der Build automatisch (Laufnummer).
- Den **Upload-Schlüssel** nie verlieren (liegt auf OneDrive und dem USB-Stick).
- Premium/In-App-Abo: erst einrichten, wenn das Gewerbe angemeldet und RevenueCat verbunden ist. Bis dahin ist Premium in der App ausgeschaltet und alles frei.
