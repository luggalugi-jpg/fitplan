/* Anleitungen für das Lauftraining.
   g = Gruppe ("basis" Grundlagen, "einheit" Einheiten aus den Laufplänen), i = Symbol, t = Titel, k = Kurzbeschreibung,
   s = Abschnitte [Überschrift, [Punkte]]. Allgemeine Hinweise, kein Ersatz für ärztlichen Rat. */
(function(){
const A=[
/* ---------- Grundlagen ---------- */
{id:"intens",g:"basis",i:"🎚️",t:"Wie schnell soll ich laufen?",k:"Anstrengung, Sprechtest und Pulszonen – so triffst du jede Einheit richtig.",s:[
 ["Die Anstrengungsskala (RPE)",["In den Plänen steht oft „RPE 3–4/10“. RPE heißt: Wie anstrengend fühlt es sich an – 1 ist Gehen, 10 ist volle Erschöpfung.",
  "RPE 2–4: locker. Du kannst ganze Sätze sprechen. Das ist das Tempo für Grundlagen-, Regenerations- und lange Läufe.",
  "RPE 5–6: zügig. Kurze Sätze gehen noch, ein Gespräch wird mühsam. Typisch für Tempodauerläufe.",
  "RPE 7–9: hart. Nur noch einzelne Wörter. Das ist der Bereich für Intervalle und Bergsprints."]],
 ["Sprechtest",["Der einfachste Test unterwegs: Sag laut einen ganzen Satz. Klappt das ohne Japsen, bist du im lockeren Bereich.",
  "Wenn du bei einem lockeren Lauf nicht mehr sprechen kannst, nimm Tempo raus oder geh ein paar Schritte – das ist kein Versagen, sondern richtig trainiert."]],
 ["Pulszonen",["Zone 1 (sehr locker, ca. 50–60 % der maximalen Herzfrequenz): Auslaufen, Regeneration.",
  "Zone 2 (locker, ca. 60–70 %): der Großteil deines Trainings. Baut Ausdauer auf, ohne dich zu ermüden.",
  "Zone 3 (zügig, ca. 70–80 %): Tempodauerlauf.",
  "Zone 4–5 (hart, über 80 %): Intervalle, nur in kurzen Abschnitten.",
  "Formeln wie „220 minus Alter“ sind nur grobe Schätzungen und können um 10–15 Schläge danebenliegen. Verlass dich im Zweifel lieber auf Gefühl und Sprechtest."]],
 ["Die wichtigste Regel",["Etwa 80 % deiner Laufzeit sollten wirklich locker sein. Die meisten Läufer laufen ihre lockeren Läufe zu schnell und die harten zu langsam – dreh das um."]]]},
{id:"warm",g:"basis",i:"🔥",t:"Aufwärmen & Lauf-ABC",k:"In 10 Minuten bereit für jede Einheit.",s:[
 ["Vor jedem Lauf",["5–10 Minuten sehr locker traben oder zügig gehen. Der Körper wird warm, Puls und Atmung kommen langsam hoch.",
  "Bei lockeren Läufen reicht das: Die ersten Minuten einfach bewusst langsamer starten."]],
 ["Vor Tempo, Intervallen und Bergläufen zusätzlich",["Lauf-ABC (je ca. 20–30 m, 1–2 Durchgänge): Fußgelenksarbeit (kleine, schnelle Schritte über den Vorfuß), Kniehebelauf, Anfersen, Hopserlauf.",
  "Danach 3–4 Steigerungen über 60–80 m: locker beginnen, bis etwa 85 % des Maximaltempos steigern, ausrollen, zurückgehen.",
  "Statisches Dehnen (lange halten) gehört nicht vor harte Einheiten – lieber dynamisch bewegen: Beinpendel, Ausfallschritte, Hüftkreisen."]],
 ["Auslaufen",["5–10 Minuten locker traben oder gehen, bis Puls und Atmung ruhig sind.",
  "Danach ist ein guter Zeitpunkt für leichtes Dehnen von Waden, Oberschenkeln und Hüfte."]]]},
{id:"technik",g:"basis",i:"🦶",t:"Lauftechnik",k:"Ökonomisch und gelenkschonend laufen.",s:[
 ["Haltung",["Aufrecht, leicht nach vorn geneigt – aus den Sprunggelenken, nicht aus der Hüfte abknicken.",
  "Blick nach vorn (ca. 10–20 m), Schultern locker und tief, Hände locker, nicht verkrampfen."]],
 ["Schritt",["Der Fuß landet möglichst unter dem Körperschwerpunkt, nicht weit vor dir. Weite Schritte mit Landung auf der Ferse vor dem Körper bremsen und belasten die Knie.",
  "Eine etwas höhere Schrittfrequenz hilft oft: lieber viele kurze, leichte Schritte als wenige lange. Richtwert für viele Läufer: um 165–180 Schritte pro Minute – das ist aber individuell.",
  "Ob du über Ferse, Mittelfuß oder Vorfuß landest, ist zweitrangig. Wichtiger ist, dass der Fuß nicht weit vor dem Körper aufsetzt."]],
 ["Arme",["Arme etwa im 90-Grad-Winkel locker vor und zurück schwingen, nicht quer vor dem Körper.",
  "Am Berg und beim Endspurt helfen kräftigere Armbewegungen."]],
 ["Atmung",["Atme durch Mund und Nase, so wie es sich natürlich anfühlt.",
  "Seitenstechen: Tempo raus, tief und langsam ausatmen, eventuell kurz gehen."]]]},
{id:"aufbau",g:"basis",i:"📈",t:"Sicher steigern & Verletzungen vorbeugen",k:"Wie du dranbleibst, ohne dich zu überlasten.",s:[
 ["Langsam steigern",["Erhöhe immer nur eine Sache: entweder Dauer, Häufigkeit oder Tempo – nicht alles gleichzeitig.",
  "Muskeln und Ausdauer passen sich schneller an als Sehnen, Bänder und Knochen. Auch wenn es sich leicht anfühlt: Gib dem Körper Zeit.",
  "Die Entlastungswochen im Plan sind wichtig – dort wird der Fortschritt gefestigt."]],
 ["Warnsignale",["Normal: leichter Muskelkater, müde Beine am nächsten Tag.",
  "Pausieren und beobachten: Schmerz, der beim Laufen stärker wird, an einer Stelle punktuell sitzt (z. B. Schienbein, Ferse, Knie, Fußrücken) oder dich hinken lässt.",
  "Ärztlich abklären lassen: Schmerzen, die nach ein paar Tagen Pause nicht besser werden, Schwellungen, Brustschmerzen, Schwindel oder ungewöhnliche Atemnot."]],
 ["Was hilft",["Krafttraining 1–2× pro Woche (Beine, Hüfte, Rumpf) macht dich stabiler – die Kraftpläne in GainPilot lassen sich mit Laufplänen kombinieren.",
  "Schlaf und ausreichend Essen sind Teil des Trainings.",
  "Laufschuhe nach Gefühl wählen: Sie sollten bequem sein und nicht drücken. Viele Läufer wechseln sie nach etwa 600–1000 km."]],
 ["Krafttraining und Laufen am selben Tag",["Harte Laufeinheiten und schwere Beintage möglichst nicht direkt hintereinander legen.",
  "Wenn beides an einem Tag sein muss: das Wichtigere zuerst, dazwischen einige Stunden Pause."]]]},
{id:"essen",g:"basis",i:"🍌",t:"Essen & Trinken rund ums Laufen",k:"Energie für Training und Erholung.",s:[
 ["Vorher",["Kurze, lockere Läufe gehen auch nüchtern oder nach einem kleinen Snack.",
  "Vor längeren oder harten Einheiten 1–3 Stunden vorher eine leicht verdauliche Mahlzeit mit Kohlenhydraten, z. B. Haferflocken, Brot, Banane. Wenig Fett und Ballaststoffe direkt davor."]],
 ["Unterwegs",["Unter etwa 60 Minuten reicht meist Wasser – oder gar nichts.",
  "Bei längeren Läufen: regelmäßig trinken und ab etwa 60–75 Minuten Kohlenhydrate zuführen (z. B. Gel, Banane, Sportgetränk). Im Training ausprobieren, nie erst am Wettkampftag."]],
 ["Danach",["Innerhalb von ein paar Stunden eine Mahlzeit mit Eiweiß und Kohlenhydraten – das unterstützt die Erholung.",
  "Trinke über den Tag verteilt genug, besonders bei Hitze."]]]},
{id:"test",g:"basis",i:"⏱️",t:"5-km-Test & Wettkampf",k:"Fortschritt messen und am Tag X gut laufen.",s:[
 ["5-km-Test",["Gut aufwärmen (10 Min. locker plus 3 Steigerungen).",
  "5 km so gleichmäßig wie möglich, die erste Hälfte eher etwas zurückhaltend, am Ende zulegen.",
  "Trage den Lauf in GainPilot ein: Er zählt für deinen Lauf-Wert in der Rangliste."]],
 ["Die letzten Tage vor dem Wettkampf",["Die letzte Woche ist ruhiger: weniger Umfang, ein paar kurze, flotte Abschnitte halten dich frisch.",
  "Nichts Neues ausprobieren: keine neuen Schuhe, kein ungewohntes Essen."]],
 ["Am Wettkampftag",["Rechtzeitig da sein, locker aufwärmen.",
  "Nicht zu schnell starten – die Aufregung macht schneller als geplant. Halte dich an deine Zielpace.",
  "Nach dem Lauf: auslaufen, trinken, essen und in den Tagen danach locker regenerieren."]]]},
/* ---------- Einheiten aus den Laufplänen ---------- */
{id:"grundlage",g:"einheit",i:"🟢",t:"Lockerer Grundlagenlauf",k:"Das Fundament jedes Plans – locker und gleichmäßig.",s:[
 ["Ziel",["Baut die aerobe Ausdauer auf: Herz, Kreislauf und Muskeln werden effizienter, ohne dass du lange Erholung brauchst."]],
 ["So geht's",["Ruhig anlaufen und dann gleichmäßig im lockeren Bereich bleiben (RPE 2–4, Sprechtest bestanden).",
  "Gehpausen sind ausdrücklich erlaubt, wenn der Puls zu hoch wird."]],
 ["Häufige Fehler",["Zu schnell: Wenn sich der Lauf „gut trainiert“ anfühlt, ist er meist zu hart.",
  "Jedes Mal Bestzeit laufen wollen – dafür sind andere Einheiten da."]]]},
{id:"lang",g:"einheit",i:"🛣️",t:"Langer Lauf",k:"Die längste Einheit der Woche – Dauer vor Tempo.",s:[
 ["Ziel",["Stärkt die Ausdauer, gewöhnt Muskeln, Sehnen und Kopf an lange Belastungen und verbessert den Fettstoffwechsel."]],
 ["So geht's",["Im lockeren Tempo laufen, eher langsamer als bei deinen normalen Läufen.",
  "Bei Läufen über 60–75 Minuten Wasser und eventuell Kohlenhydrate mitnehmen.",
  "Eine flache, abwechslungsreiche Strecke oder eine Runde, an der du an einer Trinkstelle vorbeikommst, macht es einfacher."]],
 ["Häufige Fehler",["Zu schnell beginnen und am Ende einbrechen.",
  "Den langen Lauf direkt nach einem harten Tag legen – plane ihn lieber nach einem Ruhetag."]]]},
{id:"regeneration",g:"einheit",i:"🌿",t:"Regenerationslauf",k:"Kurz und sehr locker – fördert die Erholung.",s:[
 ["Ziel",["Durchblutung anregen und die Beine lockern, ohne neuen Trainingsreiz zu setzen."]],
 ["So geht's",["Sehr langsam, kürzer als deine anderen Läufe, Zone 1–2 bzw. RPE 2–3.",
  "Flache Strecke, gern auf weichem Untergrund."]],
 ["Gut zu wissen",["Wenn du dich müde oder angeschlagen fühlst, ist ein Ruhetag oder ein Spaziergang die bessere Wahl."]]]},
{id:"laufgeh",g:"einheit",i:"🚶",t:"Lauf-Geh-Training",k:"Der sanfte Einstieg – Laufen und Gehen im Wechsel.",s:[
 ["Ziel",["Ausdauer aufbauen, ohne dich zu überfordern. Ideal für den Einstieg oder den Wiedereinstieg nach einer Pause."]],
 ["So geht's",["Laufe die angegebenen Abschnitte sehr locker und gehe in den Pausen zügig weiter.",
  "Von Woche zu Woche werden die Laufabschnitte länger und die Gehpausen kürzer.",
  "Eine Intervall-Uhr oder ein Handy-Timer hilft beim Wechseln."]],
 ["Gut zu wissen",["Wenn eine Woche zu schwer war, wiederhole sie – das ist völlig normal."]]]},
{id:"steigerungen",g:"einheit",i:"⚡",t:"Lauf mit Steigerungen",k:"Lockerer Lauf plus kurze, flotte Abschnitte.",s:[
 ["Ziel",["Verbessert Lauftechnik, Schrittfrequenz und Spritzigkeit, ohne zu ermüden."]],
 ["So geht's",["Erst den lockeren Lauf wie geplant.",
  "Danach 4–6 Steigerungen über ca. 60–100 m: langsam beginnen, bis etwa 85–90 % deines Maximaltempos steigern, ausrollen lassen.",
  "Zwischen den Steigerungen ganz zurückgehen oder locker traben, bis du dich wieder frisch fühlst."]],
 ["Häufige Fehler",["Sprinten bis zum Anschlag – die Steigerungen sollen flüssig und locker wirken."]]]},
{id:"tempo",g:"einheit",i:"🔶",t:"Tempodauerlauf & Tempoblöcke",k:"Zügig und kontrolliert – schiebt deine Wohlfühl-Geschwindigkeit nach oben.",s:[
 ["Ziel",["Erhöht das Tempo, das du lange halten kannst (Schwelle). Sehr wirksam für 5 km bis Halbmarathon."]],
 ["So geht's",["10–15 Minuten einlaufen, Lauf-ABC und 2–3 Steigerungen.",
  "Den Tempoabschnitt zügig, aber kontrolliert laufen (RPE 6–7, kurze Sätze gehen noch). Bei Tempoblöcken mehrere Abschnitte mit kurzen Trabpausen.",
  "Beim progressiven Dauerlauf locker beginnen und das Tempo in Etappen steigern; das letzte Drittel ist zügig.",
  "10 Minuten auslaufen."]],
 ["Häufige Fehler",["Zu schnell anfangen: Der letzte Kilometer sollte genauso schnell oder schneller sein als der erste.",
  "Tempoläufe an zwei Tagen hintereinander."]]]},
{id:"intervall",g:"einheit",i:"🔴",t:"Intervalltraining",k:"Schnelle Abschnitte mit Pausen – für mehr Tempo und Sauerstoffaufnahme.",s:[
 ["Ziel",["Steigert die maximale Sauerstoffaufnahme und die Geschwindigkeit. Kurze Intervalle (z. B. 400 m) machen schneller, lange (z. B. 1000 m) verbessern die Tempohärte."]],
 ["So geht's",["Gründlich aufwärmen: 10–15 Minuten locker, Lauf-ABC, 3–4 Steigerungen.",
  "Die Intervalle hart, aber gleichmäßig laufen (RPE 7–9). Alle Wiederholungen sollten etwa gleich schnell sein.",
  "In den Pausen locker traben oder gehen, wie im Plan angegeben.",
  "Bei Pyramiden werden die Abschnitte erst länger, dann wieder kürzer – teile die Kraft entsprechend ein.",
  "10 Minuten auslaufen."]],
 ["Häufige Fehler",["Das erste Intervall viel zu schnell – lieber etwas zurückhaltend starten und am Ende zulegen.",
  "Zu wenig Erholung zwischen harten Tagen: Nach Intervallen folgt mindestens ein lockerer Tag."]],
 ["Gut zu wissen",["Eine 400-m-Bahn oder eine vermessene Strecke macht es einfacher; mit GPS-Uhr geht es überall."]]]},
{id:"fahrtspiel",g:"einheit",i:"🎲",t:"Fahrtspiel",k:"Tempowechsel nach Gefühl und Gelände.",s:[
 ["Ziel",["Trainiert Tempohärte und Tempogefühl auf spielerische Art – weniger starr als Intervalle."]],
 ["So geht's",["Nach dem Einlaufen wechselst du zwischen schnellen und lockeren Abschnitten, wie es Plan, Gelände und Gefühl vorgeben: z. B. bis zur nächsten Laterne schnell, dann locker bis zur Kreuzung.",
  "Die schnellen Abschnitte zügig bis hart, die lockeren wirklich locker.",
  "Im Gelände nutzt du Hügel und Wege als natürliche Abschnitte."]],
 ["Gut zu wissen",["Fahrtspiel ist ideal, wenn du keine Lust auf Uhr und Zahlen hast."]]]},
{id:"berg",g:"einheit",i:"⛰️",t:"Bergläufe & Bergintervalle",k:"Kraft und Tempo am Hang.",s:[
 ["Ziel",["Kräftigt Beine und Füße, verbessert die Laufökonomie und bereitet auf hügelige Strecken vor – mit weniger Stoßbelastung als schnelle Läufe in der Ebene."]],
 ["So geht's",["Suche einen gleichmäßigen Anstieg (ca. 4–8 % Steigung).",
  "Nach dem Einlaufen die Bergabschnitte kraftvoll hinauflaufen: aufrecht bleiben, kurze Schritte, aktiver Armeinsatz, Blick nach vorn.",
  "Zurück geht es locker bergab traben oder gehen – das ist die Pause.",
  "Bei längeren Bergwiederholungen das Tempo so wählen, dass die letzte Wiederholung noch gleich gut gelingt."]],
 ["Häufige Fehler",["Weit vorgebeugt laufen.",
  "Bergab zu schnell – das belastet Knie und Oberschenkel stark."]]]},
{id:"trail",g:"einheit",i:"🌲",t:"Trail- und Geländelauf",k:"Laufen auf Waldwegen und Pfaden.",s:[
 ["Ziel",["Stärkt Füße, Sprunggelenke und Koordination, bringt Abwechslung und schont durch weichen Boden."]],
 ["So geht's",["Nach Zeit und Anstrengung laufen, nicht nach Tempo – im Gelände bist du automatisch langsamer.",
  "Steile Anstiege ruhig gehen, das ist auch bei Profis üblich.",
  "Bergab kurze, schnelle Schritte und den Blick ein paar Meter vorausrichten."]],
 ["Sicherheit",["Strecke vorher anschauen, Handy mitnehmen und bei längeren Läufen jemandem Bescheid geben.",
  "Schuhe mit gutem Profil helfen auf rutschigem Untergrund."]]]}
];
const TYP=n=>{n=String(n||"").toLowerCase();
 if(/geh/.test(n))return "laufgeh";if(/regeneration/.test(n))return "regeneration";if(/steigerung/.test(n))return "steigerungen";
 if(/berg|hügel/.test(n))return "berg";if(/trail|gelände/.test(n))return /fahrtspiel/.test(n)?"fahrtspiel":"trail";
 if(/fahrtspiel|tempowechsel/.test(n))return "fahrtspiel";if(/intervall|pyramide|400-m|vo2/.test(n))return "intervall";
 if(/tempo|schwelle|progressiv/.test(n))return "tempo";if(/lang/.test(n))return "lang";return "grundlage";};
window.LAUF_ANL={liste:A,get:id=>A.find(x=>x.id==id),typ:TYP};
})();
