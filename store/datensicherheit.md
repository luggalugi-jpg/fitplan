# Angaben zum Datenschutz in den Stores

Grundlage: Die App speichert alles nur auf dem Gerät. Daten verlassen das Gerät nur bei zwei Funktionen, die der Nutzer selbst auslöst:
1. **Foto-Analyse** (optional, eigener Google-Gemini-Schlüssel): Das Foto geht direkt an Google.
2. **Barcode-Suche**: Die Produktnummer geht an Open Food Facts (keine personenbezogenen Daten außer der technisch nötigen IP-Adresse).

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
| Alles andere (Gesundheit, Fitness, Standort, Kontakte, Kennungen, App-Aktivität, Absturzberichte) | **Nicht erhoben** – bleibt auf dem Gerät |

**Standort (ab Version 3.11):** Die App fragt den genauen Standort ab, um die Pausenspiele nur im gespeicherten Gym freizuschalten. Der Abgleich passiert ausschließlich auf dem Gerät, nichts wird übertragen. Nach Googles Regeln gelten Daten, die das Gerät nicht verlassen, nicht als „erhoben“ – Standort bleibt daher **nicht erhoben**. Die Berechtigung (ACCESS_FINE_LOCATION, nur im Vordergrund) muss trotzdem in der Datenschutzerklärung stehen – ist erledigt. Keine Hintergrund-Standorterklärung nötig.

**Hinweis für die App-Prüfung (Google und Apple):** Die Prüfer sind nicht in deinem Gym. Im Feld für Prüfhinweise erklären, dass die Pausenspiele erst nach dem Speichern eines Gyms vor Ort spielbar sind und man zum Testen am aktuellen Ort „Ich bin in meinem Gym – speichern“ wählen kann.

Zusätzlich in der Play Console:
- **Gesundheits-Apps-Erklärung** (Health apps declaration): Kategorie „Ernährung und Gewichtsmanagement“ sowie „Fitness“ wählen. Keine Verbindung zu Health Connect.
- **Werbe-ID**: „Nein, meine App nutzt keine Werbe-ID.“
- **Zielgruppe**: ab 18 (oder ab 16) – nicht für Kinder.

## Apple – „App-Datenschutz“ in App Store Connect

Empfehlung (vorsichtige Variante):

| Datentyp | Angabe |
|---|---|
| **Fotos oder Videos** | Erhoben für **App-Funktionalität**, **nicht mit der Identität verknüpft**, **kein Tracking** |
| Alle anderen Typen | Nicht erhoben |

Begründung: Apple zählt Daten als „erhoben“, wenn sie das Gerät verlassen und ein Dritter sie länger als für die sofortige Antwort behalten könnte. Bei der Gemini API hängt das von Googles Bedingungen für den Schlüssel des Nutzers ab. Die vorsichtige Angabe ist daher „Fotos – App-Funktionalität“.

Weitere Apple-Angaben:
- **Exportbestimmungen**: Die App nutzt nur Standard-Verschlüsselung (HTTPS) → `ITSAppUsesNonExemptEncryption = NO` ist im Build gesetzt.
- **Tracking (ATT)**: kein Tracking, kein Abfragedialog nötig.
- **Privacy Manifest**: Capacitor und die verwendeten Plugins bringen ihre eigenen Datenschutz-Manifeste mit; vor dem Einreichen den Datenschutzbericht in Xcode-Organizer bzw. die Warnungen in App Store Connect prüfen.
