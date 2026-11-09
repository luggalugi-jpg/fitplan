# Fit-Wochenplan in Play Store und App Store bringen

Diese Anleitung passt zum Ordner `app/` (Capacitor 8) und den drei Abläufen unter **Actions** in deinem GitHub-Repo. Du brauchst keinen Mac und kein Android Studio: Gebaut wird in der Cloud bei GitHub.

## Was ist schon erledigt
- App-Code für die native Hülle: Speicher wird zusätzlich nativ gesichert (iOS kann den Web-Speicher sonst leeren), Sicherung über das Teilen-Menü, Vibration, Benachrichtigung am Pausenende, nativer Barcode-Scanner, Links öffnen im Browser, kein Service Worker in der App.
- Rechtliches in der App (Mehr → Rechtliches) und als Webseiten: `datenschutz.html`, `impressum.html`, `gesundheitshinweis.html`.
- Begrüßung beim ersten Start mit Gesundheitshinweis.
- Spielnamen geändert: „Tetris“ → **Blocksturz**, „Memory“ → **Farbfolge** (beides geschützte Marken).
- Neues App-Icon, Startbild, Feature-Grafik, Store-Screenshots, Store-Texte, Datenschutz-Antworten.

## Schritt 1 – Angaben eintragen (10 Minuten)
1. In `essensplan.html` ganz oben `ANBIETER` ausfüllen: Name, ladungsfähige Anschrift, E-Mail. Ohne diese Angaben zeigt die App rote Platzhalter.
2. Dieselben Angaben in `datenschutz.html` und `impressum.html` ersetzen (Platzhalter in eckigen Klammern).
3. In `app/capacitor.config.json` die `appId` festlegen, z. B. `de.deinname.fitwochenplan`. **Danach nie mehr ändern** – sie ist die dauerhafte Kennung in beiden Stores.
4. Alles ins Repo hochladen (Ordner `app/`, `.github/`, `store/` und die Web-Dateien).
5. Prüfen, ob `https://DEIN-NAME.github.io/DEIN-REPO/datenschutz.html` erreichbar ist – diese Adresse brauchen beide Stores.

## Schritt 2 – Android (Google Play)
1. **Entwicklerkonto** anlegen: play.google.com/console, einmalig 25 US-Dollar, Identitätsprüfung mit Ausweis.
2. **Upload-Schlüssel**: Actions → „1 · Android-Schlüssel erzeugen“ → Run workflow. Artefakt herunterladen, `upload.jks` und `passwoerter.txt` sicher aufbewahren (Passwort-Manager + Backup). Unter Settings → Secrets and variables → Actions vier Secrets anlegen:
   `ANDROID_KEYSTORE_BASE64` (Inhalt der .txt-Datei), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (= upload), `ANDROID_KEY_PASSWORD`. Danach den Workflow-Lauf löschen.
3. **Bauen**: Actions → „2 · Android-App bauen“. Ergebnis: `app-release.aab` als Artefakt.
4. In der Play Console App anlegen, **Play App Signing** aktiv lassen, `.aab` in **Interner Test** hochladen und auf dem eigenen Handy installieren.
5. **Geschlossener Test (Pflicht für neue private Konten)**: mindestens **12 Tester**, **14 Tage ununterbrochen** dabei. Erst danach kannst du die Produktion beantragen.
6. Store-Eintrag ausfüllen mit `store/texte-de.md`, Grafiken aus `store/grafiken/` und `store/screenshots/android/`, Datensicherheit aus `store/datensicherheit.md`, Altersfreigabe-Fragebogen, Zielgruppe, Gesundheits-App-Erklärung.

## Schritt 3 – iOS (App Store)
1. **Apple Developer Program**: 99 US-Dollar pro Jahr. Als Privatperson oder mit Firma (Firma braucht eine D-U-N-S-Nummer).
2. In App Store Connect: **App anlegen** mit derselben Bundle-ID wie `appId`.
3. **API-Schlüssel** für den automatischen Upload: App Store Connect → Benutzer und Zugriff → Integrationen → App Store Connect API → Schlüssel mit Rolle „App Manager“. Secrets anlegen:
   `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8_BASE64` (die .p8-Datei base64-kodiert), `APPLE_TEAM_ID` (unter developer.apple.com → Membership).
4. **Bauen und hochladen**: Actions → „3 · iOS-App bauen und hochladen“. Der Build erscheint nach einigen Minuten in **TestFlight**. Dort auf dem iPhone testen.
5. Store-Eintrag: Texte, Screenshots aus `store/screenshots/ios-6.9/`, App-Datenschutz, Altersfreigabe, Prüfernotiz (siehe Texte). Zur Prüfung einreichen.

## Schritt 4 – Vor dem Einreichen auf echten Geräten prüfen
- Erster Start, Daten eintragen, App schließen und neu öffnen: alles noch da?
- Pause starten, App in den Hintergrund: kommt die Benachrichtigung?
- Barcode scannen (Android lädt den Google-Scanner beim ersten Mal nach).
- Sicherung erstellen und wieder einlesen.
- Foto-Analyse mit eigenem Schlüssel.
- Dunkelmodus, große Schrift, iPhone mit Notch / Dynamic Island, kleines Android-Gerät.

## Bekannte Punkte, die du entscheiden musst
- **Name**: Prüfe vor dem Anlegen, ob „Fit-Wochenplan“ im Store frei ist, und recherchiere beim DPMA/EUIPO nach Markenkonflikten.
- **Händler-Status (EU)**: Beide Stores fragen, ob du als Händler (Trader) auftrittst. Wer Geld verdient oder gewerblich handelt, muss Adresse, Telefon und E-Mail öffentlich im Store zeigen. Für eine kostenlose Hobby-App ohne Einnahmen kommt meist „kein Händler“ in Frage – im Zweifel rechtlich beraten lassen.
- **Foto-Analyse mit eigenem Schlüssel**: Funktioniert, ist aber für normale Nutzer umständlich. Später wäre ein eigener kleiner Server mit deinem Schlüssel möglich (dann ändern sich Datenschutz und Kosten).
