# GainPilot in Play Store und App Store bringen

Diese Anleitung passt zum Ordner `app/` (Capacitor 8) und den drei Abläufen unter **Actions** in deinem GitHub-Repo. Du brauchst keinen Mac und kein Android Studio: Gebaut wird in der Cloud bei GitHub.

## Was ist schon erledigt
- App-Code für die native Hülle: Speicher wird zusätzlich nativ gesichert (iOS kann den Web-Speicher sonst leeren), Sicherung über das Teilen-Menü, Vibration, Benachrichtigung am Pausenende, nativer Barcode-Scanner, Links öffnen im Browser, kein Service Worker in der App.
- Rechtliches in der App (Mehr → Rechtliches) und als Webseiten: `datenschutz.html`, `impressum.html`, `gesundheitshinweis.html`.
- Begrüßung beim ersten Start mit Gesundheitshinweis.
- Spielnamen geändert: „Tetris“ → **Blocksturz**, „Memory“ → **Farbfolge** (beides geschützte Marken).
- Neues App-Icon, Startbild, Feature-Grafik, Store-Screenshots, Store-Texte, Datenschutz-Antworten.

## Schritt 1 – Angaben (erledigt)
- Anbieter in App und Webseiten: Luca Preikschas, Herzog-Wilhelm-Str. 32, 94572 Schöfweg, gainpilot.app@gmail.com
- App-Name: **GainPilot**
- App-Kennung (Bundle-ID / Paketname): `de.preikschas.gainpilot` – **nach der ersten Veröffentlichung nie mehr ändern**
- Datenschutz-Adresse für beide Stores: `https://luggalugi-jpg.github.io/fitplan/datenschutz.html` (nach dem Hochladen prüfen, ob sie erreichbar ist)

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
- Mehr → Erinnerungen: Training, Wasser oder Mahlzeiten einschalten, Uhrzeit auf in zwei Minuten stellen, App schließen: kommt die Erinnerung? Nach einem Neustart des Telefons auch noch?
- Barcode scannen (Android lädt den Google-Scanner beim ersten Mal nach).
- Sicherung erstellen und wieder einlesen.
- Foto-Analyse mit eigenem Schlüssel.
- Dunkelmodus, große Schrift, iPhone mit Notch / Dynamic Island, kleines Android-Gerät.

## Bekannte Punkte, die du entscheiden musst
- **Name**: Festgelegt am 11.11.2026 (vorher Arbeitstitel Gainora). Eine kurze Websuche nach „GainPilot“ ergab keine App mit genau diesem Namen (Stand 10.11.2026) – das ersetzt keine Markenrecherche. Vor dem Anlegen trotzdem selbst prüfen: Suche in Play Store und App Store, DPMAregister (Klassen 9, 41, 44) und TMview/EUIPO. Wer den Namen dauerhaft absichern will, kann ihn beim DPMA als Marke anmelden (ab 290 €).
- **Händler-Status (EU)**: Beide Stores fragen, ob du als Händler (Trader) auftrittst. Wer Geld verdient oder gewerblich handelt, muss Adresse, Telefon und E-Mail öffentlich im Store zeigen. Für eine kostenlose Hobby-App ohne Einnahmen kommt meist „kein Händler“ in Frage – im Zweifel rechtlich beraten lassen.
- **Foto-Analyse mit eigenem Schlüssel**: Funktioniert, ist aber für normale Nutzer umständlich. Später wäre ein eigener kleiner Server mit deinem Schlüssel möglich (dann ändern sich Datenschutz und Kosten).
