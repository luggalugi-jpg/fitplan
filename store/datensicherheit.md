# Angaben zum Datenschutz in den Stores

Grundlage: Die App speichert alles nur auf dem Gerät. Daten verlassen das Gerät nur bei drei Funktionen, die der Nutzer selbst auslöst (die dritte ist die freiwillige Rangliste, siehe unten):
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
| Alles andere (Gesundheit, Standort, Kontakte, Absturzberichte) | **Nicht erhoben** – bleibt auf dem Gerät |

**Rangliste (ab Version 3.16, freiwillig, nur nach Einwilligung):** Diese Daten gehen an den eigenen Server (Supabase, Paris). Supabase ist Auftragsverarbeiter – das zählt bei Google nicht als „Teilen“. Alle Einträge: **erhoben: Ja, geteilt: Nein, optional, Zweck: App-Funktionen**, Löschung in der App (Teilnahme beenden).

| Datentyp (Play) | Was genau |
|---|---|
| **Persönliche Daten → Name** | Spitzname (frei gewählt, für andere sichtbar) |
| **Persönliche Daten → Andere Info** | Geschlecht und Altersgruppe (freiwillig, nur für den Vergleich) |
| **Gesundheit und Fitness → Fitnessinformationen** | Trainingstage, erledigte Übungen, beste Sätze (Gewicht, Wiederholungen), Körpergewicht (freiwillig) |
| **App-Aktivitäten → Andere Aktionen** | Ergebnisse gewerteter Pausenspiele mit Start- und Endzeit |
| **App-Info und Leistung / Geräte- oder andere IDs** | zufällige Nutzerkennung des anonymen Kontos → bei „Geräte- oder andere IDs“ angeben |

**Konto und Cloud-Sicherung (ab Version 3.17, freiwillig):** zusätzlich angeben – erhoben: Ja, geteilt: Nein, optional, Zweck: App-Funktionen und Kontoverwaltung:

| Datentyp (Play) | Was genau |
|---|---|
| **Persönliche Daten → E-Mail-Adresse** | Anmeldung, Bestätigungs- und Passwort-Mails |
| **Gesundheit und Fitness → Gesundheitsinformationen und Fitnessinformationen** | Cloud-Sicherung enthält Gewicht, Ernährung, Training |
| **Persönliche Daten → Andere Info** | Profilangaben in der Sicherung (Alter, Größe, Ziele) |
| **App-Aktivitäten → Andere nutzergenerierte Inhalte** | eigene Gerichte, Pläne, Notizen in der Sicherung |

Apple zusätzlich: **E-Mail-Adresse** und **Gesundheit** – App-Funktionalität, mit Identität verknüpft, kein Tracking.

**Account-Löschung (Pflicht bei Konten):** In der App unter Mehr → Konto & Cloud → „Konto löschen“. Für Google zusätzlich eine Web-Adresse angeben, unter der man die Löschung beantragen kann: die Datenschutz-URL (Abschnitt 6 nennt die E-Mail-Adresse).

Die Frage „Können Nutzer das Löschen beantragen?“ bleibt **Ja**: Mehr → Daten & Sicherung → „Teilnahme beenden und Daten löschen“ löscht sofort alles auf dem Server. Wer die App ohne das löscht, kann per E-Mail die Löschung verlangen (steht in der Datenschutzerklärung). Google verlangt bei Konten zusätzlich eine **Web-Adresse zum Löschen** – dafür die Datenschutz-URL mit dem Abschnitt Speicherdauer und Löschung angeben.

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
| **Fitness** (Rangliste, freiwillig) | Erhoben für **App-Funktionalität**, **mit der Identität verknüpft** (anonymes Konto), **kein Tracking** |
| **Name** (Spitzname) | wie Fitness |
| **Nutzer-ID** | wie Fitness |
| **Gameplay-Inhalte / Sonstige Nutzungsdaten** (Spielergebnisse) | wie Fitness |
| Alle anderen Typen | Nicht erhoben |

Begründung: Apple zählt Daten als „erhoben“, wenn sie das Gerät verlassen und ein Dritter sie länger als für die sofortige Antwort behalten könnte. Bei der Gemini API hängt das von Googles Bedingungen für den Schlüssel des Nutzers ab. Die vorsichtige Angabe ist daher „Fotos – App-Funktionalität“.

Weitere Apple-Angaben:
- **Exportbestimmungen**: Die App nutzt nur Standard-Verschlüsselung (HTTPS) → `ITSAppUsesNonExemptEncryption = NO` ist im Build gesetzt.
- **Tracking (ATT)**: kein Tracking, kein Abfragedialog nötig.
- **Privacy Manifest**: Capacitor und die verwendeten Plugins bringen ihre eigenen Datenschutz-Manifeste mit; vor dem Einreichen den Datenschutzbericht in Xcode-Organizer bzw. die Warnungen in App Store Connect prüfen.
