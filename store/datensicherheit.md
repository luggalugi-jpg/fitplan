# Angaben zum Datenschutz in den Stores

Grundlage: Die App speichert alles nur auf dem Gerät. Daten verlassen das Gerät nur bei zwei Funktionen, die der Nutzer selbst auslöst:
1. **Foto-Analyse** (optional, eigener Google-Gemini-Schlüssel): Das Foto geht direkt an Google.
2. **Barcode-Suche**: Die Produktnummer geht an Open Food Facts (keine personenbezogenen Daten außer der technisch nötigen IP-Adresse).
3. **Rangliste** (optional, mit Einwilligung): Spitzname, anonyme Kennung und Bestwerte (Pausenspiel-Rekorde, bester Satz je Übung) gehen an Supabase (EU) und sind für andere Nutzer sichtbar.

Diese Antworten sind ein Vorschlag nach bestem Wissen, keine Rechtsberatung. Du bist für die Angaben verantwortlich.

## Google Play – Formular „Datensicherheit“

| Frage | Antwort |
|---|---|
| Erhebt oder teilt deine App erforderliche Nutzerdaten? | **Ja** (wegen der optionalen Foto-Analyse) |
| Werden alle Daten bei der Übertragung verschlüsselt? | **Ja** (HTTPS) |
| Können Nutzer das Löschen ihrer Daten beantragen? | **Ja** – in der App unter Mehr → Daten & Sicherung, oder durch Deinstallieren. Es gibt kein Konto. |
| Datentyp | **Fotos und Videos → Fotos** |
| Erhoben / geteilt | Erhoben: **Ja**. Geteilt: **Nein** – die Übertragung an Google erfolgt auf ausdrücklichen Wunsch des Nutzers (Ausnahme „vom Nutzer initiierte Übertragung“). |
| Verarbeitung | **Optional** (Nutzer kann die Funktion weglassen); **kurzzeitig** (nicht gespeichert durch dich) |
| Zweck | **App-Funktionen** |
| Datentyp (Rangliste) | **Gesundheit und Fitness → Fitnessinformationen** (Bestwerte je Übung); **App-Aktivität → Andere nutzergenerierte Inhalte** (Spitzname); **App-Aktivität → Andere Aktionen** (Spiel-Rekorde); **Geräte- oder andere IDs** (anonyme Kennung) |
| Erhoben / geteilt (Rangliste) | Erhoben: **Ja**. Geteilt: **Nein** (Supabase ist Auftragsverarbeiter; die Anzeige für andere Nutzer ist die gewünschte Funktion) |
| Verarbeitung (Rangliste) | **Optional**; nicht kurzzeitig (bleibt bis zum Austritt gespeichert) |
| Zweck (Rangliste) | **App-Funktionen** |
| Löschen (Rangliste) | In der App: Mehr → Rangliste → „Rangliste verlassen und Daten löschen“ |
| Alles andere (Gewicht, Ernährung, übriges Training, Standort, Kontakte, Absturzberichte) | **Nicht erhoben** – bleibt auf dem Gerät |

Zusätzlich in der Play Console:
- **Gesundheits-Apps-Erklärung** (Health apps declaration): Kategorie „Ernährung und Gewichtsmanagement“ sowie „Fitness“ wählen. Keine Verbindung zu Health Connect.
- **Werbe-ID**: „Nein, meine App nutzt keine Werbe-ID.“
- **Zielgruppe**: ab 18 (oder ab 16) – nicht für Kinder.

## Apple – „App-Datenschutz“ in App Store Connect

Empfehlung (vorsichtige Variante):

| Datentyp | Angabe |
|---|---|
| **Fotos oder Videos** | Erhoben für **App-Funktionalität**, **nicht mit der Identität verknüpft**, **kein Tracking** |
| **Gesundheit & Fitness → Fitness** | Erhoben für **App-Funktionalität** (Rangliste), **nicht mit der Identität verknüpft**, **kein Tracking** |
| **Nutzerinhalte → Andere Nutzerinhalte** (Spitzname) | wie oben |
| **Kennungen → Geräte-ID** (anonyme Kennung) | wie oben |
| **Nutzungsdaten → Produktinteraktion** (Spiel-Rekorde) | wie oben |
| Alle anderen Typen | Nicht erhoben |

Begründung: Apple zählt Daten als „erhoben“, wenn sie das Gerät verlassen und ein Dritter sie länger als für die sofortige Antwort behalten könnte. Bei der Gemini API hängt das von Googles Bedingungen für den Schlüssel des Nutzers ab. Die vorsichtige Angabe ist daher „Fotos – App-Funktionalität“.

Weitere Apple-Angaben:
- **Exportbestimmungen**: Die App nutzt nur Standard-Verschlüsselung (HTTPS) → `ITSAppUsesNonExemptEncryption = NO` ist im Build gesetzt.
- **Tracking (ATT)**: kein Tracking, kein Abfragedialog nötig.
- **Privacy Manifest**: Capacitor und die verwendeten Plugins bringen ihre eigenen Datenschutz-Manifeste mit; vor dem Einreichen den Datenschutzbericht in Xcode-Organizer bzw. die Warnungen in App Store Connect prüfen.

## Rangliste: zusätzliche Store-Pflichten

- **Apple, Richtlinie 1.2 (nutzergenerierte Inhalte):** Spitznamen sind Nutzerinhalte. Die App hat dafür einen Wortfilter, „Spieler ausblenden“ und „Melden“ (E-Mail an gainora.app@gmail.com). Gemeldete Einträge innerhalb von 24 Stunden prüfen und ggf. im Supabase-Dashboard löschen (Tabelle `spieler`).
- **Apple, Richtlinie 5.1.1(v) / Google Play Kontolöschung:** Die anonyme Anmeldung gilt als Konto. Löschen geht in der App (Mehr → Rangliste → verlassen). Bei Google Play zusätzlich eine Web-Möglichkeit angeben, z. B. „Löschung per E-Mail an gainora.app@gmail.com mit deinem Spitznamen“.
- **Altersfreigabe-Fragebogen:** Frage nach Interaktion zwischen Nutzern / nutzergenerierten Inhalten mit **Ja** beantworten (Spitznamen sind öffentlich sichtbar, kein Chat).
