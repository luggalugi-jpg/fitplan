/* GainPilot – Anleitung zu allen Funktionen (Mehr → Anleitung und die ?-Knöpfe in den Bereichen).
   Einfache Sprache, kurze Schritte. Aufbau je Kapitel:
   id, ic (Symbol), t (Titel), kurz (eine Zeile), ziel (wohin „Ausprobieren“ springt),
   teile: [{h: Überschrift, s: [Schritte]} oder {h, p: Text}], tipps: [kurze Tipps] */
window.HILFE = {
 kap: [
  { id: "start", ic: "🚀", t: "Erste Schritte", kurz: "In 3 Minuten startklar",
    ziel: { tab: "more", mtab: "profil" },
    teile: [
     { h: "So legst du los", s: [
       "Öffne <b>Mehr → Profil & Gewicht</b> und trag Alter, Größe, Geschlecht, Gewicht und deine Aktivität ein.",
       "Öffne <b>Mehr → Ziele & Nährwerte</b> und wähle dein Ziel, z. B. Abnehmen oder Muskelaufbau. Die App rechnet daraus deine Kalorien und dein Eiweiß pro Tag aus.",
       "Unter <b>Training</b> suchst du dir einen Trainingsplan aus, unter <b>Planen</b> füllst du deine Essenswoche.",
       "Im Bereich <b>Heute</b> trägst du ein, was du isst. Fertig!" ] },
     { h: "So ist die App aufgebaut", p: "Unten findest du vier Bereiche: <b>Heute</b> (Essen eintragen), <b>Training</b> (Kraft und Laufen), <b>Planen</b> (Essenswoche, Einkauf, Rezepte) und <b>Fortschritt</b> (Gewicht, Level, Rangliste und Auswertung). Die Einstellungen unter <b>Mehr</b> öffnest du über das Personen-Symbol oben rechts. Du kannst auch nach links und rechts wischen, um zwischen den Bereichen zu wechseln." },
     { h: "Deine Daten", p: "Alles, was du einträgst, bleibt auf deinem Handy. Du brauchst kein Konto. Nur wenn du selbst die Rangliste oder die Cloud-Sicherung einschaltest, wird etwas an unseren Server geschickt." } ],
    tipps: [ "Fenster, die von unten hochkommen, schließt du, indem du sie nach unten wischst – oder mit dem Knopf Abbrechen.", "Die App funktioniert auch ohne Internet. Nur Barcode-Suche, Foto-Analyse, Rangliste und Cloud brauchen eine Verbindung.",
      "Oben im Bereich findest du ein <b>?</b> – es öffnet direkt die passende Anleitung." ] },

  { id: "heute", ic: "🍽️", t: "Essen eintragen", kurz: "Heute: Mahlzeiten, Kalorien und Nährwerte",
    ziel: { tab: "eat" },
    teile: [
     { h: "Was du oben siehst", p: "Der Ring zeigt, wie viele Kalorien du heute noch übrig hast. Darunter stehen Eiweiß, Kohlenhydrate und Fett im Vergleich zu deinem Tagesziel." },
     { h: "Essen hinzufügen", s: [
       "Tippe bei einer Mahlzeit auf <b>+ … hinzufügen</b> oder unten auf den Knopf <b>+ Essen</b>.",
       "Wähle oben die Mahlzeit: Frühstück, Mittagessen, Abendessen oder Snack.",
       "Wähle einen von fünf Wegen: <b>Foto analysieren</b>, <b>Barcode scannen</b>, <b>Lebensmittel suchen</b>, <b>Gericht aus der Liste</b> oder <b>Selbst eintragen</b>.",
       "Gib die Menge an und bestätige. Der Eintrag erscheint sofort bei der Mahlzeit." ] },
     { h: "Barcode scannen", s: [
       "Tippe auf <b>Barcode scannen</b>. Die Kamera startet von selbst.",
       "Halte den Strichcode der Packung in den Rahmen. Die App erkennt ihn automatisch.",
       "Prüf die Menge in Gramm und tippe auf Hinzufügen. Findet die App ein Produkt nicht, kannst du die Nummer auch eintippen." ] },
     { h: "Schneller eintragen", s: [
       "Unter <b>Zuletzt gegessen</b> trägst du ein Lebensmittel mit <b>+ nochmal</b> erneut ein.",
       "<b>Alles von gestern übernehmen</b> kopiert den kompletten Vortag.",
       "Steht ein Gericht in deinem Wochenplan, hakst du es mit einem Tipp als gegessen ab." ] },
     { h: "Einträge löschen und andere Tage", p: "Mit dem <b>✕</b> neben einem Eintrag löschst du ihn. Über die Datumsleiste oben wechselst du den Tag, mit den Pfeilen die Woche." } ],
    tipps: [ "Über der Tagesübersicht siehst du deine Serie: wie viele Tage in Folge du dein Essen eingetragen hast.",
      "Für die Foto-Analyse brauchst du einen eigenen Google-Schlüssel (siehe Kapitel „Foto-Analyse“)." ] },

  { id: "wasser", ic: "💧", t: "Wasser & Supplements", kurz: "Trinken und Präparate abhaken",
    ziel: { tab: "eat" },
    teile: [
     { h: "Wasser", s: [
       "Scroll im Bereich <b>Heute</b> nach unten zur Wasser-Karte.",
       "Tippe auf <b>+ Glas</b> oder <b>+ Flasche</b>, wenn du etwas getrunken hast.",
       "Mit <b>Ziel</b> in der Karte änderst du dein Wasser-Tagesziel." ] },
     { h: "Supplements", s: [
       "Wähle in der Supplement-Karte deine Präparate aus der Liste oder leg mit <b>+ Eigenes Präparat anlegen</b> ein eigenes an.",
       "Hake ab, was du genommen hast.",
       "Mit <b>Auf ganze Woche</b> übernimmst du die Auswahl für alle Tage." ] } ],
    tipps: [ "Unter <b>Mehr → Erinnerungen</b> kann dich die App ans Trinken erinnern." ] },

  { id: "woche", ic: "📅", t: "Essenswoche planen", kurz: "Planen → Woche: Gerichte und Wochenvorschlag",
    ziel: { tab: "plan", sub: "plan" },
    teile: [
     { h: "Woche selbst planen", s: [
       "Öffne <b>Planen → Woche</b> und wähle oben einen Tag.",
       "Tippe bei einer Mahlzeit auf <b>+ Gericht hinzufügen</b> und such dir ein Rezept oder eigenes Gericht aus.",
       "Unten siehst du, ob der Tag zu deinem Kalorien- und Eiweißziel passt." ] },
     { h: "Woche automatisch füllen", s: [
       "Tippe auf <b>Wochenvorschlag</b>.",
       "Die App füllt die ganze Woche mit Gerichten, die zu deinen Zielen passen. Deine Favoriten kommen öfter vor, gesperrte Gerichte nie.",
       "Gefällt dir ein Gericht nicht, entferne es und füge ein anderes hinzu." ] } ],
    tipps: [ "Was im Wochenplan steht, kannst du später unter <b>Heute</b> mit einem Tipp als gegessen abhaken.",
      "In der kostenlosen Version gibt es 2 automatische Wochenvorschläge pro Monat, mit Premium unbegrenzt." ] },

  { id: "einkauf", ic: "🛒", t: "Einkaufsliste", kurz: "Planen → Einkauf: automatisch aus deinem Plan",
    ziel: { tab: "plan", sub: "shop" },
    teile: [
     { h: "So funktioniert's", s: [
       "Plane zuerst deine Woche. Die Einkaufsliste entsteht daraus von selbst.",
       "Öffne <b>Planen → Einkauf</b>. Alle Zutaten stehen nach Abteilungen sortiert da, Mengen sind schon zusammengerechnet.",
       "Hake im Laden ab, was im Wagen liegt.",
       "Was du noch zu Hause hast, markierst du als <b>Schon im Vorrat</b>." ] } ],
    tipps: [ "Mit <b>Liste teilen</b> schickst du sie weiter, z. B. per WhatsApp an deinen Partner oder deine Partnerin." ] },

  { id: "gerichte", ic: "📖", t: "Rezepte & eigene Gerichte", kurz: "Planen → Gerichte: fast 3.000 Rezepte",
    ziel: { tab: "plan", sub: "meals" },
    teile: [
     { h: "Rezepte finden", s: [
       "Öffne <b>Planen → Gerichte</b>.",
       "Such nach einem Namen oder wähle eine Kategorie.",
       "Tippe auf ein Rezept, um Zutaten, Nährwerte und Zubereitung zu sehen." ] },
     { h: "Favoriten und Sperrliste", p: "Im Rezept tippst du auf <b>★ Favorit</b>, wenn du es magst – es kommt dann öfter im Wochenvorschlag vor. Gerichte, die du nicht willst, markierst du mit <b>🚫 Nie vorschlagen</b>." },
     { h: "Eigenes Gericht", s: [
       "Tippe auf <b>+ Eigenes Gericht erstellen</b>.",
       "Gib einen Namen ein und füge die Zutaten mit Menge hinzu. Die Nährwerte rechnet die App selbst aus.",
       "Speichern – das Gericht steht jetzt in deiner Liste und im Wochenplan zur Auswahl." ] } ],
    tipps: [] },

  { id: "kraftplan", ic: "🗓️", t: "Trainingsplan wählen", kurz: "Training → Kraft → Plan",
    ziel: { tab: "fit", tmode: "kraft", tsub: "stdplan" },
    teile: [
     { h: "Plan aussuchen", s: [
       "Öffne <b>Training</b>, wähle oben <b>Kraft</b> und dann <b>Plan</b>.",
       "Filtere nach der Zahl deiner Trainingstage und deinem Niveau.",
       "Wähle einen der Pläne aus. Er gilt dann für alle kommenden Wochen." ] },
     { h: "Woche anpassen", p: "Unter <b>Woche</b> siehst du, welche Übungen an welchem Tag dran sind. Mit <b>Woche neu planen</b> verteilst du die Einheiten neu, z. B. wenn du diese Woche an anderen Tagen kannst." },
     { h: "Übungen", p: "Unter <b>Übungen</b> findest du alle Übungen nach Muskelgruppen und deinen Verlauf je Übung. Mit <b>Eigene Übung</b> legst du eine neue an, mit <b>Übung hinzufügen</b> ergänzt du sie im Training." } ],
    tipps: [ "In der kostenlosen Version kannst du 2 Pläne pro Monat automatisch übernehmen, mit Premium unbegrenzt." ] },

  { id: "training", ic: "🏋️", t: "Im Training", kurz: "Sätze eintragen, Pause, Anleitung, Bestwerte",
    ziel: { tab: "fit", tmode: "kraft", tsub: "day" },
    teile: [
     { h: "Sätze eintragen", s: [
       "Öffne <b>Training → Kraft → Heute</b>. Dort stehen die Übungen von heute.",
       "Die Gewichte vom letzten Mal sind schon eingetragen. Passe Gewicht und Wiederholungen an, wenn nötig.",
       "Hake den Satz ab, wenn du fertig bist. Die Pause startet dann von selbst.",
       "Mit <b>+ Satz</b> fügst du einen weiteren Satz hinzu." ] },
     { h: "Pause", p: "Unten läuft die Pausenleiste mit der restlichen Zeit. Wenn die Pause vorbei ist, gibt das Handy ein Signal. In der Pause kannst du ein kurzes Spiel spielen (siehe „Pausenspiele“)." },
     { h: "Übung richtig ausführen", p: "Tippe auf den Namen einer Übung. Du siehst eine 3D-Figur, bei der die trainierten Muskeln rot leuchten, und eine Schritt-für-Schritt-Anleitung." },
     { h: "Bestwerte", p: "Schaffst du mehr als je zuvor, feiert die App deinen neuen Bestwert. Mit <b>📸 Teilen</b> machst du daraus ein Bild für Instagram oder WhatsApp." } ],
    tipps: [ "Die Pausenlänge stellst du unter <b>Mehr → Training & Pausen</b> ein.",
      "Für die Rangliste und deine Serie zählen nur Sätze, die du wirklich abgehakt hast." ] },

  { id: "smart", ic: "🧠", t: "Smartes Training", kurz: "Steigerung, Plateau und Deload-Woche",
    ziel: { tab: "fit", tmode: "kraft", tsub: "day" },
    teile: [
     { h: "Steigerungsvorschlag", p: "Hast du letztes Mal alle Wiederholungen geschafft, schlägt die App mehr Gewicht oder mehr Wiederholungen vor. Mit einem Tipp übernimmst du den Vorschlag." },
     { h: "Plateau", p: "Kommst du bei einer Übung 3 Einheiten lang nicht weiter, bekommst du einen Hinweis. Ab 4 Einheiten schlägt die App vor, mit etwas weniger Gewicht (90 %) neu aufzubauen." },
     { h: "Deload-Woche", p: "Nach 6 Wochen am Stück oder bei mehreren Plateaus schlägt die App eine leichte Woche mit etwa 60 % Gewicht vor. Danach geht es mit deinen alten Gewichten weiter – meist mit neuer Kraft." },
     { h: "Pause je Übung", p: "Fallen deine Wiederholungen von Satz zu Satz stark ab, schlägt die App für diese Übung eine längere Pause vor." } ],
    tipps: [ "Alle Vorschläge sind freiwillig. Du kannst sie immer ignorieren." ] },

  { id: "spiele", ic: "🎮", t: "Pausenspiele & Level", kurz: "Spielen in der Satzpause, XP und Erfolge",
    ziel: { tab: "fit", tmode: "kraft", tsub: "day" },
    teile: [
     { h: "Spiel starten", s: [
       "Hake einen Satz ab – die Pause startet.",
       "Tippe in der Pausenleiste auf <b>🎮 Spielen</b>.",
       "Wähle ein Spiel oder nimm den <b>Schnellstart</b>. Er sucht ein Spiel aus, das in die restliche Pausenzeit passt." ] },
     { h: "Nur im Gym", s: [
       "Öffne <b>Mehr → Training & Pausen</b> und speichere dein Gym, während du dort bist.",
       "Ab dann lassen sich die Spiele nur im Gym spielen – so bleibt der Fokus auf dem Training.",
       "Dein Standort wird dabei nur auf deinem Handy verglichen." ] },
     { h: "Level und XP", p: "Für erledigte Übungen, komplette Trainings, Bestwerte, Läufe und Spiele sammelst du XP. Damit steigst du im Athleten-Level auf – von „Aufwärmer“ bis „Legende“. Tippe auf deine Level-Karte, um zu sehen, wofür es wie viele XP gibt." } ],
    tipps: [ "Für die Rangliste zählt nur die erste Runde nach einem abgehakten Satz. Weitere Runden kannst du frei spielen.",
      "Kostenlos spielbar ist Reaction Rush, mit Premium alle sieben Spiele." ] },

  { id: "laufen", ic: "🏃", t: "Laufen", kurz: "Laufziel, Laufplan und Läufe eintragen",
    ziel: { tab: "fit", tmode: "lauf" },
    teile: [
     { h: "Laufplan einrichten", s: [
       "Öffne <b>Training</b> und wähle oben <b>Laufen</b>.",
       "Unter <b>Ziel & Plan</b> legst du dein Laufziel fest, z. B. 10 km an einem bestimmten Datum oder einfach regelmäßig laufen.",
       "Wähle einen passenden Plan und deine Lauftage." ] },
     { h: "Läufe eintragen", s: [
       "Unter <b>Woche</b> siehst du deine geplanten Einheiten.",
       "Nach dem Lauf trägst du Distanz und Dauer ein, wenn du magst auch Puls, Anstrengung und eine Notiz. Das Tempo rechnet die App aus.",
       "Spontan gelaufen? Nimm <b>+ Freien Lauf eintragen</b>." ] },
     { h: "Wie laufe ich die Einheit?", p: "Bei jeder Einheit steht <b>📖 Anleitung</b>. Dort steht, wie schnell du laufen sollst und worauf du achten musst. Alle Anleitungen findest du auch unter <b>Anleitungen</b>." },
     { h: "Verlauf", p: "Unter <b>Verlauf</b> siehst du dein Tempo, deine Distanzen und deine Kilometer pro Woche." } ],
    tipps: [ "Neu beim Laufen? Lies zuerst die Anleitung „Tempo und Pulszonen“." ] },

  { id: "fortschritt", ic: "📈", t: "Fortschritt", kurz: "Gewicht, Analyse und Wochenrückblick",
    ziel: { tab: "prog", sub: "weight" },
    teile: [
     { h: "Gewicht", s: [
       "Öffne <b>Fortschritt → Gewicht</b> und tippe auf <b>Gewicht eintragen</b>.",
       "Wieg dich am besten morgens, nach dem Toilettengang und vor dem Frühstück.",
       "Die Kurve zeigt deinen 7-Tage-Trend. Der ist aussagekräftiger als einzelne Tage." ] },
     { h: "Analyse", p: "Unter <b>Analyse</b> wertet die App die letzten Wochen aus: Passt dein Gewichtsverlauf zu deinem Ziel? Isst du genug Eiweiß? Trainierst du regelmäßig? Bei Bedarf passt du dein Kalorienziel direkt dort an." },
     { h: "Wochen", p: "Unter <b>Wochen</b> vergleichst du, was du geplant und was du wirklich gegessen hast." } ],
    tipps: [ "In der kostenlosen Version zeigen die Diagramme die letzten 4 Wochen, mit Premium deinen ganzen Verlauf.",
      "Den Verlauf je Übung findest du unter <b>Training → Kraft → Übungen</b>." ] },

  { id: "rangliste", ic: "🏆", t: "Rangliste", kurz: "Mit anderen vergleichen – freiwillig",
    ziel: { tab: "fit", tmode: "kraft", tsub: "day" },
    teile: [
     { h: "Mitmachen", s: [
       "Öffne <b>Training → Kraft → Heute</b> und tippe auf die Ranglisten-Karte.",
       "Wähle einen Spitznamen und einen Avatar und stimme zu. Du brauchst keine E-Mail.",
       "Wenn du magst, gib Geschlecht, Altersgruppe und Gewicht an. So wirst du fair mit Leuten verglichen, die zu dir passen. Andere sehen diese Angaben nicht." ] },
     { h: "Die Wertungen", p: "<b>Kraft & Lauf</b>: deine Stärke im Verhältnis zu deinem Körpergewicht und deine beste Laufzeit. <b>Spiele</b>: dein Monats-Rating aus den Pausenspielen. <b>Gesamt</b>: alles zusammen plus Fleiß, mit Stufen von Rookie bis Legende – und dazu die Monatsliga mit Auf- und Abstieg. <b>Freunde</b>: deine Gruppen und dein Studio." },
     { h: "Freundesgruppe", s: [
       "Öffne die Rangliste und wechsle zu <b>Freunde</b>.",
       "Erstelle eine Gruppe und gib ihr einen Namen.",
       "Teile den Code oder den Link mit deinen Freunden. Wer ihn eingibt oder antippt, ist dabei." ] },
     { h: "Mein Studio", s: [
       "Geh in dein Gym und öffne <b>Rangliste → Freunde</b>.",
       "Tippe auf <b>Studio festlegen</b> und erlaube den Standort.",
       "Wähle dein Studio aus der Liste oder leg es mit Namen neu an. Jetzt siehst du, wer bei dir im Studio der Stärkste ist." ] },
     { h: "Aufhören", p: "Unter <b>Mehr → Daten & Sicherung</b> kannst du deine Teilnahme jederzeit beenden. Dann werden alle deine Daten auf dem Server sofort gelöscht." } ],
    tipps: [ "Unrealistische Werte werden nicht gewertet. Siehst du einen Schummler, melde ihn mit dem Melden-Knopf." ] },

  { id: "sicherung", ic: "💾", t: "Sicherung, Konto & Export", kurz: "Daten nicht verlieren, Handy wechseln",
    ziel: { tab: "more", mtab: "daten" },
    teile: [
     { h: "Sicherung als Datei (kostenlos)", s: [
       "Öffne <b>Mehr → Daten & Sicherung</b>.",
       "Tippe auf <b>Sicherung erstellen / teilen</b> und speichere die Datei, z. B. in deiner Cloud oder per Mail an dich selbst.",
       "Auf einem neuen Handy tippst du auf <b>Daten einlesen</b> und wählst die Datei aus." ] },
     { h: "Konto mit Cloud-Sicherung", s: [
       "Öffne <b>Mehr → Konto & Cloud</b> und gib deine E-Mail-Adresse ein.",
       "Bestätige die E-Mail und leg ein Passwort fest.",
       "Ab dann sichert die App deine Daten automatisch. Auf einem neuen Handy meldest du dich einfach an." ] },
     { h: "Daten exportieren (Premium)", s: [
       "Öffne <b>Mehr → Daten & Sicherung</b> und scroll zu <b>Daten exportieren</b>.",
       "Wähle den Zeitraum und was drin sein soll: Gewicht, Ernährung, Training, Laufen.",
       "Tippe auf <b>PDF-Bericht</b> (z. B. für deinen Coach oder Arzt) oder <b>CSV (Excel)</b> für eigene Auswertungen." ] } ],
    tipps: [ "Ohne Konto und ohne Sicherung sind deine Daten weg, wenn du die App löschst oder das Handy verlierst. Sichere also regelmäßig." ] },

  { id: "einstellungen", ic: "⚙️", t: "Einstellungen & Erinnerungen", kurz: "Ziele, Pausen, Erinnerungen, Foto-Analyse",
    ziel: { tab: "more" },
    teile: [
     { h: "Ziele ändern", p: "Unter <b>Mehr → Ziele & Nährwerte</b> änderst du dein Ziel oder stellst Kalorien, Eiweiß, Kohlenhydrate und Fett von Hand ein." },
     { h: "Erinnerungen", s: [
       "Öffne <b>Mehr → Erinnerungen</b>.",
       "Schalte ein, woran dich die App erinnern soll: Training, Wasser oder Mahlzeiten.",
       "Stell die Uhrzeiten ein und erlaube Benachrichtigungen, wenn das Handy fragt." ] },
     { h: "Foto-Analyse einrichten", s: [
       "Hol dir einen kostenlosen Schlüssel bei Google AI Studio (Gemini).",
       "Trag ihn unter <b>Mehr → Foto-Analyse</b> ein.",
       "Jetzt kannst du beim Essen-Hinzufügen ein Foto machen und die KI schätzt die Nährwerte." ] },
     { h: "Training & Pausen", p: "Unter <b>Mehr → Training & Pausen</b> stellst du ein, wie lang die Satzpause ist, siehst deine Pausenspiele mit Rekorden und verwaltest deine gespeicherten Gyms." } ],
    tipps: [ "Die Schätzung per Foto ist ein Richtwert. Für genaue Werte wieg dein Essen oder scanne den Barcode.", "Die App gibt es auf Deutsch und Englisch. Unter <b>Mehr → Sprache · Language</b> stellst du sie um." ] },

  { id: "premium", ic: "✨", t: "Premium", kurz: "Was ist kostenlos, was gibt's mit Premium?",
    ziel: { tab: "more", mtab: "premium" },
    teile: [
     { h: "Kostenlos", p: "Essen eintragen, Barcode, Rezepte, Wochenplan und Einkaufsliste, Trainings- und Laufpläne, Sätze und Läufe eintragen, Rangliste, Sicherung – das Wichtigste ist immer kostenlos. Einige Extras sind begrenzt: 2 automatische Essens- und Trainingspläne pro Monat, Diagramme der letzten 4 Wochen, ein Pausenspiel, 3D-Anleitungen für 8 Grundübungen und eigene Freundesgruppen bis 3 Personen." },
     { h: "Mit Premium", p: "Alle Grenzen fallen weg: unbegrenzte Pläne, dein ganzer Verlauf, alle Pausenspiele, alle 3D-Anleitungen, große Freundesgruppen, mehr Designs für Bestwert-Bilder und der Export als PDF und Excel." },
     { h: "Abo verwalten", p: "Unter <b>Mehr → Premium</b> siehst du dein Abo, kannst einen Kauf wiederherstellen (z. B. auf einem neuen Handy) und kommst zur Abo-Verwaltung im Play Store oder App Store. Kündigen geht dort jederzeit." } ],
    tipps: [] },

  { id: "fragen", ic: "❓", t: "Häufige Fragen", kurz: "Wenn etwas nicht klappt",
    ziel: null,
    teile: [
     { h: "Der Barcode wird nicht gefunden", p: "Nicht jedes Produkt steht in der Datenbank. Gib die Nährwerte dann mit <b>Selbst eintragen</b> ein – beim nächsten Mal findest du es unter „Zuletzt gegessen“." },
     { h: "Die Kamera startet nicht", p: "Erlaube der App den Zugriff auf die Kamera in den Einstellungen deines Handys (Apps → GainPilot → Berechtigungen)." },
     { h: "Ich bekomme keine Erinnerungen", p: "Prüfe, ob Benachrichtigungen für GainPilot erlaubt sind und ob der Stromsparmodus die App einschränkt." },
     { h: "Ist ein Update da?", p: "Die App merkt neue Versionen selbst und zeigt einen Hinweis. Unter <b>Mehr → Über die App</b> siehst du deine Version." },
     { h: "Etwas funktioniert nicht richtig", s: [
       "Öffne <b>Mehr → Über die App</b>.",
       "Tippe auf <b>Diagnoseprotokoll speichern</b>.",
       "Schick uns die Datei zusammen mit einer kurzen Beschreibung. Sie enthält nur technische Angaben, keine Essens- oder Trainingsdaten." ] },
     { h: "Ich habe ein neues Handy", p: "Mit Konto meldest du dich einfach an. Ohne Konto erstellst du auf dem alten Handy eine Sicherung und liest sie auf dem neuen ein (siehe „Sicherung, Konto & Export“)." } ],
    tipps: [] }
 ]
};
