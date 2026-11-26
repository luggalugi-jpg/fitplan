# GainPilot – 500 neue Rezepte (DE+EN) für dünne Kategorien. Nährwerte aus naehr.py berechnet.
import json, itertools, os
D = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(D, 'naehr.py')).read())
G, ML, ST = 0, 1, 2
CAT = {"ofen": 15, "shake": 2, "salat": 9, "dessert": 14, "veg": 7}
OUT = []

def R(de, en, cat, z, t, ing, steps, salz=True):
    OUT.append(dict(de=de, en=en, cat=CAT[cat], z=z, t=t, ing=ing, steps=steps, salz=salz))

# ---------- Zutaten-Kürzel (Index in RDB_N) ----------
HAFER, MILCH, WHEY, BEEREN, ZIMT, SKYR, CHIA, HEIDEL, GRJOG, MANDELDRINK, ERDNUSSMUS, BANANE, QUARK, APFEL, WALNUSS, KAKAO, KIRSCHEN, ERYTHRIT, KOKOSMILCH, MANGO, KOKOSRASPEL, MANDELN, HONIG, KUERBISKERNE, EI, EIKLAR, BACKPULVER, RAPSOEL, DINKELMEHL, ERDBEEREN = range(30)
ROSINEN, BUTTER, APFELMUS, VANILLE, HIMBEEREN, ZARTBITTER = 30, 31, 32, 33, 34, 35
BIRNE, LEINSAMEN, VKTOAST, VKBROT, HUETTENKAESE, JOGHURT, ZITRONE, KAROTTEN, HOKKAIDO, AHORN, ANANAS, KIWI, SPINAT = 37, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50
QUINOA, PFIRSICH, DATTELN, INGWER, BASILIKUM, PAPRIKA, FETA, CHAMPIGNONS, FRUEHLINGSZW, AVOCADO, CHERRY, GURKE, RADIESCHEN, KRAEUTER, FRISCHKAESE, RAEUCHERLACHS, TOMDOSE, ZWIEBEL, KNOBLAUCH, OLIVENOEL, GEWUERZE, PETERSILIE, ZUCCHINI, LAUCH, WRAP, SCHWBOHNEN, SALSA, REIBEKAESE = range(52, 80)
BLATTSALAT, TOMATEN, SENF, SESAM, RAEUCHERTOFU, TOFU, BROKKOLI, RUCOLA, HUMMUS, THUNFISCH, SUESSKARTOFFEL, BRUEHE, PARMESAN, KARTOFFELN, SCHINKEN, MOZZARELLA, BALSAMICO, KIDNEY, KORIANDER, HAEHNCHEN, WASSER, ERBSENPROTEIN, MANDELMUS, ORANGE, ROTEBETE, LIMETTE, BASMATI, SOJASAUCE, CURRYPASTE, GRUENEBOHNEN = range(81, 111)
WOKGEMUESE, SESAMOEL, VKNUDELN, STAERKE, COUSCOUS, PESTO, MAIS, KICHERERBSEN, PASSIERT, ERBSEN = 112, 113, 114, 115, 116, 117, 118, 119, 120, 121
BULGUR, ROTKOHL, SRIRACHA, EDAMAME, ESSIG, SELLERIE, ROTELINSEN, CASHEW, AUBERGINE, OLIVEN, PUTE, PUTENHACK, TOMATENMARK = 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136
FELDSALAT, GRANATAPFEL, RINDERHACK, SCHWEINEFILET, BLUMENKOHL, SPARGEL, LACHS, KABELJAU, KAPERN, GARNELEN, SEELACHS = 139, 140, 144, 146, 147, 149, 150, 151, 152, 153, 154
FENCHEL, BERGLINSEN, ERDNUESSE, TAHIN, RICOTTA, TEMPEH, SOJASCHNETZEL, WEISSEBOHNEN, GELATINE, SALZ = 156, 157, 158, 159, 161, 162, 163, 165, 171, 172
FETA_ = FETA
SCHMAND, SAURESAHNE, DILL, MEHL405, ZIEGENKAESE, FALAFEL, ROTEZWIEBEL, CHEDDAR = 199, 198, 214, 215, 217, 213, 185, 216
SAHNE = 194

# =====================================================================
# 1) OFENGERICHTE (140)
# =====================================================================
PROT_OFEN = [  # key, de (für Titel), en, Zutat, Menge/Portion, Garzeit-Hinweis
    ("hae", "Hähnchen", "chicken", HAEHNCHEN, 150, "Hähnchenbrust", "chicken breast", 22),
    ("put", "Putenbrust", "turkey breast", PUTE, 150, "Putenbrust", "turkey breast", 22),
    ("lac", "Lachs", "salmon", LACHS, 130, "Lachsfilet", "salmon fillet", 15),
    ("kab", "Kabeljau", "cod", KABELJAU, 170, "Kabeljaufilet", "cod fillet", 14),
    ("see", "Seelachs", "pollock", SEELACHS, 170, "Seelachsfilet", "pollock fillet", 14),
    ("sch", "Schweinefilet", "pork tenderloin", SCHWEINEFILET, 150, "Schweinefilet", "pork tenderloin", 20),
    ("gar", "Garnelen", "prawns", GARNELEN, 160, "Garnelen", "prawns", 8),
    ("tof", "Tofu", "tofu", TOFU, 180, "Tofu (in Würfeln)", "tofu (cubed)", 25),
]
VEG_OFEN = [  # de, en, Zutaten
    ("Brokkoli & Paprika", "broccoli & peppers", [(BROKKOLI, 150), (PAPRIKA, 100)]),
    ("Zucchini & Cherrytomaten", "courgette & cherry tomatoes", [(ZUCCHINI, 150), (CHERRY, 120)]),
    ("Karotten & Fenchel", "carrots & fennel", [(KAROTTEN, 120), (FENCHEL, 120)]),
    ("Blumenkohl & roter Zwiebel", "cauliflower & red onion", [(BLUMENKOHL, 180), (ROTEZWIEBEL, 60)]),
    ("grünem Spargel & Champignons", "green asparagus & mushrooms", [(SPARGEL, 150), (CHAMPIGNONS, 100)]),
]
BEI_OFEN = [  # de, en, Zutat, Menge
    ("Kartoffeln", "potatoes", KARTOFFELN, 250),
    ("Süßkartoffeln", "sweet potatoes", SUESSKARTOFFEL, 230),
]
WUERZ_OFEN = {  # passende Würzung je Protein
    "hae": ("Paprikapulver und Kräutern", "paprika and herbs"),
    "put": ("Kräutern und Knoblauch", "herbs and garlic"),
    "lac": ("Zitrone und Dill", "lemon and dill"),
    "kab": ("Zitrone und Petersilie", "lemon and parsley"),
    "see": ("Zitrone und Kräutern", "lemon and herbs"),
    "sch": ("Senf und Kräutern", "mustard and herbs"),
    "gar": ("Knoblauch und Chili", "garlic and chilli"),
    "tof": ("Sojasauce und Paprikapulver", "soy sauce and paprika"),
}
EXTRA_OFEN = {
    "lac": [(ZITRONE, 10), (DILL, 3)], "kab": [(ZITRONE, 10), (PETERSILIE, 5)], "see": [(ZITRONE, 10), (KRAEUTER, 5)],
    "sch": [(SENF, 10), (KRAEUTER, 5)], "gar": [(KNOBLAUCH, 5), (SRIRACHA, 5)], "tof": [(SOJASAUCE, 15)],
    "hae": [(GEWUERZE, 3), (KRAEUTER, 5)], "put": [(KNOBLAUCH, 5), (KRAEUTER, 5)],
}
for (k, pde, pen, pid, pg, pnde, pnen, gz), (vde, ven, vz), (bde, ben, bid, bg) in itertools.product(PROT_OFEN, VEG_OFEN, BEI_OFEN):
    wde, wen = WUERZ_OFEN[k]
    de = f"Ofen-{pde} mit {bde}, {vde}" if False else f"{pde} vom Blech mit {bde} und {vde}"
    en = f"Sheet-pan {pen} with {ben} and {ven}"
    ing = [(bid, bg, G), (pid, pg, G)] + [(z, m, G) for z, m in vz] + [(OLIVENOEL, 12, G)] + [(z, m, G) for z, m in EXTRA_OFEN[k]] + [(SALZ, 1, G)]
    steps = [
        ("Backofen auf 200 °C Ober-/Unterhitze vorheizen.", "Preheat the oven to 200 °C (top and bottom heat)."),
        (f"{bde} waschen und in mundgerechte Stücke schneiden, mit der Hälfte des Olivenöls, Salz und Pfeffer mischen und auf einem Backblech mit Backpapier 15 Minuten vorbacken.",
         f"Wash the {ben}, cut into bite-sized pieces, toss with half the olive oil, salt and pepper and pre-bake on a lined baking tray for 15 min."),
        (f"Gemüse putzen und klein schneiden. {pnde} trocken tupfen und mit dem restlichen Öl, {wde} würzen.",
         f"Trim and chop the vegetables. Pat the {pnen} dry and season with the remaining oil, {wen}."),
        (f"Gemüse und {pnde} auf das Blech geben und alles weitere {gz} Minuten backen, bis alles gar ist.",
         f"Add the vegetables and {pnen} to the tray and bake everything for another {gz} min until cooked through."),
        ("Mit Salz und Pfeffer abschmecken und servieren.", "Season with salt and pepper and serve."),
    ]
    R(de, en, "ofen", 1, 15 + gz + 10, ing, steps)

GEFUELLT = [  # Gefäß de/en, Zutat, Menge, Backzeit
    ("Paprika", "peppers", PAPRIKA, 250, 30), ("Zucchini", "courgettes", ZUCCHINI, 300, 25), ("Süßkartoffeln", "sweet potatoes", SUESSKARTOFFEL, 300, 45)]
FUELLUNG = [  # de, en, Zutaten, Anbraten?
    ("Rinderhack", "beef mince", [(RINDERHACK, 120), (ZWIEBEL, 40), (TOMDOSE, 80), (REIBEKAESE, 25)], "Rinderhack mit der Zwiebel krümelig anbraten, die gehackten Tomaten einrühren und würzen.", "Brown the beef mince with the onion, stir in the chopped tomatoes and season."),
    ("Putenhack", "turkey mince", [(PUTENHACK, 120), (ZWIEBEL, 40), (TOMDOSE, 80), (REIBEKAESE, 25)], "Putenhack mit der Zwiebel krümelig anbraten, die gehackten Tomaten einrühren und würzen.", "Brown the turkey mince with the onion, stir in the chopped tomatoes and season."),
    ("Quinoa & Feta", "quinoa & feta", [(QUINOA, 50), (FETA, 50), (CHERRY, 60), (KRAEUTER, 5)], "Quinoa nach Packungsangabe garen, mit zerbröseltem Feta, geviertelten Cherrytomaten und Kräutern mischen.", "Cook the quinoa according to the packet, mix with crumbled feta, quartered cherry tomatoes and herbs."),
    ("Thunfisch & Mais", "tuna & sweetcorn", [(THUNFISCH, 100), (MAIS, 50), (FRISCHKAESE, 40), (REIBEKAESE, 20)], "Thunfisch mit Mais und Frischkäse verrühren und würzen.", "Mix the tuna with the sweetcorn and cream cheese and season."),
    ("Linsen & Spinat", "lentils & spinach", [(ROTELINSEN, 50), (SPINAT, 80), (ZWIEBEL, 30), (FETA, 30)], "Rote Linsen in Brühe oder Wasser 10 Minuten weich kochen, Zwiebel und Spinat kurz andünsten und alles mit Feta mischen.", "Simmer the red lentils in stock or water for 10 min until soft, briefly sauté the onion and spinach and mix everything with the feta."),
    ("Hähnchen & Frischkäse", "chicken & cream cheese", [(HAEHNCHEN, 120), (FRISCHKAESE, 40), (FRUEHLINGSZW, 20), (REIBEKAESE, 20)], "Hähnchenbrust klein würfeln, anbraten und mit Frischkäse und Frühlingszwiebeln mischen.", "Dice the chicken breast, fry it and mix with the cream cheese and spring onions."),
]
for (gde, gen, gid, gm, bz), (fde, fen, fz, sde, sen) in itertools.product(GEFUELLT, FUELLUNG):
    vor = ("Süßkartoffeln längs halbieren und mit der Schnittfläche nach unten 25 Minuten vorbacken, dann etwas Fruchtfleisch herauslösen.", "Halve the sweet potatoes lengthways and pre-bake cut side down for 25 min, then scoop out some of the flesh.") if gid == SUESSKARTOFFEL else \
          (f"{gde} längs halbieren und entkernen bzw. aushöhlen.", f"Halve the {gen} lengthways and deseed or hollow them out.")
    ing = [(gid, gm, G)] + [(z, m, G) for z, m in fz] + [(OLIVENOEL, 5, G), (SALZ, 1, G)]
    nm = f"Gefüllte {gde} mit {fde}"
    if nm == "Gefüllte Paprika mit Quinoa & Feta": nm = "Gefüllte Paprika mit Quinoa, Feta & Tomaten"
    R(nm, f"Stuffed {gen} with {fen}", "ofen", 1, bz + 15, ing, [
        ("Backofen auf 190 °C Ober-/Unterhitze vorheizen.", "Preheat the oven to 190 °C (top and bottom heat)."),
        vor, (sde, sen),
        (f"Die Füllung in die {gde} geben und im Ofen {bz if gid != SUESSKARTOFFEL else 20} Minuten backen.", f"Spoon the filling into the {gen} and bake for {bz if gid != SUESSKARTOFFEL else 20} min."),
    ])

AUFL_BASIS = [("Kartoffel", "Potato", KARTOFFELN, 250, "Kartoffeln schälen, in dünne Scheiben schneiden und 8 Minuten in Salzwasser vorkochen.", "Peel the potatoes, slice thinly and parboil in salted water for 8 min."),
              ("Süßkartoffel", "Sweet potato", SUESSKARTOFFEL, 230, "Süßkartoffeln schälen, in Würfel schneiden und 6 Minuten vorkochen.", "Peel the sweet potatoes, dice and parboil for 6 min."),
              ("Blumenkohl", "Cauliflower", BLUMENKOHL, 300, "Blumenkohl in Röschen teilen und 5 Minuten in Salzwasser vorgaren.", "Cut the cauliflower into florets and precook in salted water for 5 min."),
              ("Quinoa", "Quinoa", QUINOA, 60, "Quinoa nach Packungsangabe garen.", "Cook the quinoa according to the packet.")]
AUFL_VAR = [("Brokkoli & Käse", "broccoli & cheese", [(BROKKOLI, 150), (REIBEKAESE, 40)]),
            ("Hähnchen & Spinat", "chicken & spinach", [(HAEHNCHEN, 120), (SPINAT, 80), (REIBEKAESE, 25)]),
            ("Schinken & Erbsen", "ham & peas", [(SCHINKEN, 70), (ERBSEN, 70), (REIBEKAESE, 25)]),
            ("Hackfleisch & Tomate", "mince & tomato", [(RINDERHACK, 110), (TOMDOSE, 100), (REIBEKAESE, 25)]),
            ("Lachs & Lauch", "salmon & leek", [(LACHS, 110), (LAUCH, 100), (REIBEKAESE, 20)]),
            ("Feta & Zucchini", "feta & courgette", [(FETA, 50), (ZUCCHINI, 150), (CHERRY, 60)])]
for (bde, ben, bid, bm, bst, bsten), (vde, ven, vz) in itertools.product(AUFL_BASIS, AUFL_VAR):
    ing = [(bid, bm, G)] + [(z, m, G) for z, m in vz] + [(MILCH, 100, ML), (EI, 1, ST), (GEWUERZE, 2, G), (SALZ, 1, G)]
    R(f"{bde}-Auflauf mit {vde}", f"{ben} bake with {ven}", "ofen", 1, 45, ing, [
        ("Backofen auf 200 °C Ober-/Unterhitze vorheizen.", "Preheat the oven to 200 °C (top and bottom heat)."),
        (bst, bsten),
        ("Die übrigen Zutaten außer dem Käse klein schneiden bzw. anbraten und mit der Basis in eine Auflaufform geben.", "Chop the remaining ingredients except the cheese (fry any meat or fish first) and put them in a baking dish with the base."),
        ("Milch mit dem Ei verquirlen, würzen und darübergießen. Mit Käse bestreuen.", "Whisk the milk with the egg, season and pour over. Sprinkle with cheese."),
        ("Im Ofen 25 Minuten goldbraun backen.", "Bake for 25 min until golden brown."),
    ])

for fde, fen, fz in [("Hähnchen", "chicken", [(HAEHNCHEN, 120)]), ("Putenhack", "turkey mince", [(PUTENHACK, 110)]), ("schwarzen Bohnen", "black beans", [(SCHWBOHNEN, 120)]),
                     ("Rinderhack", "beef mince", [(RINDERHACK, 110)]), ("Süßkartoffel & Bohnen", "sweet potato & beans", [(SUESSKARTOFFEL, 120), (KIDNEY, 70)]), ("Garnelen", "prawns", [(GARNELEN, 130)])]:
    ing = [(WRAP, 2, ST)] + [(z, m, G) for z, m in fz] + [(PAPRIKA, 80, G), (MAIS, 40, G), (SALSA, 80, G), (REIBEKAESE, 30, G), (GEWUERZE, 3, G), (SALZ, 1, G)]
    R(f"Enchiladas mit {fde}", f"{fen[0].upper()+fen[1:]} enchiladas", "ofen", 1, 35, ing, [
        ("Backofen auf 200 °C Ober-/Unterhitze vorheizen.", "Preheat the oven to 200 °C (top and bottom heat)."),
        ("Füllung klein schneiden, Fleisch oder Garnelen anbraten und mit Paprika, Mais, der Hälfte der Salsa und den Gewürzen mischen.", "Chop the filling, fry any meat or prawns and mix with the pepper, sweetcorn, half the salsa and the spices."),
        ("Die Füllung auf die Wraps verteilen, aufrollen und nebeneinander in eine Auflaufform legen.", "Divide the filling between the wraps, roll up and place side by side in a baking dish."),
        ("Mit der restlichen Salsa bestreichen, mit Käse bestreuen und 15 Minuten überbacken.", "Brush with the remaining salsa, sprinkle with cheese and bake for 15 min."),
    ])

for fde, fen, fz in [("Spinat & Feta", "spinach & feta", [(SPINAT, 80), (FETA, 40)]), ("Paprika & Schinken", "pepper & ham", [(PAPRIKA, 80), (SCHINKEN, 50)]),
                     ("Brokkoli & Käse", "broccoli & cheese", [(BROKKOLI, 100), (REIBEKAESE, 25)]), ("Zucchini & Kräutern", "courgette & herbs", [(ZUCCHINI, 120), (KRAEUTER, 8)]),
                     ("Kartoffeln & Lauch", "potato & leek", [(KARTOFFELN, 120), (LAUCH, 60)]), ("Lachs & Dill", "salmon & dill", [(RAEUCHERLACHS, 50), (DILL, 3)])]:
    ing = [(EI, 3, ST), (EIKLAR, 60, G), (MILCH, 40, ML)] + [(z, m, G) for z, m in fz] + [(OLIVENOEL, 4, G), (SALZ, 1, G)]
    R(f"Ofen-Frittata mit {fde}", f"Oven frittata with {fen}", "ofen", 1, 30, ing, [
        ("Backofen auf 190 °C Ober-/Unterhitze vorheizen.", "Preheat the oven to 190 °C (top and bottom heat)."),
        ("Gemüse klein schneiden und in einer ofenfesten Pfanne im Öl 4 Minuten andünsten (Kartoffeln vorher garen).", "Chop the vegetables and sauté in the oil in an ovenproof pan for 4 min (cook potatoes first)."),
        ("Eier, Eiklar und Milch verquirlen, kräftig würzen und über das Gemüse gießen. Restliche Zutaten darauf verteilen.", "Whisk the eggs, egg white and milk, season well and pour over the vegetables. Scatter over the remaining ingredients."),
        ("Im Ofen 15–18 Minuten stocken lassen, bis die Oberfläche fest ist.", "Bake for 15–18 min until set on top."),
    ])

for de, en, z, t, ing, st in [
    ("Moussaka light mit Putenhack", "Light moussaka with turkey mince", 2, 70, [(AUBERGINE, 300), (KARTOFFELN, 250), (PUTENHACK, 250), (ZWIEBEL, 60), (PASSIERT, 200), (JOGHURT, 150), (EI, 1), (REIBEKAESE, 40), (OLIVENOEL, 10), (GEWUERZE, 4), (SALZ, 2)],
     [("Backofen auf 200 °C vorheizen. Aubergine und Kartoffeln in Scheiben schneiden, mit wenig Öl bestreichen und 15 Minuten vorbacken.", "Preheat the oven to 200 °C. Slice the aubergine and potatoes, brush with a little oil and pre-bake for 15 min."),
      ("Putenhack mit Zwiebel anbraten, passierte Tomaten und Gewürze zugeben und 10 Minuten köcheln lassen.", "Brown the turkey mince with the onion, add the passata and spices and simmer for 10 min."),
      ("Gemüse und Hacksauce abwechselnd in eine Form schichten. Joghurt mit Ei verquirlen, darübergießen und mit Käse bestreuen.", "Layer the vegetables and meat sauce in a dish. Whisk the yoghurt with the egg, pour over and sprinkle with cheese."),
      ("30 Minuten goldbraun backen.", "Bake for 30 min until golden.")]),
    ("Ofen-Ratatouille mit Feta", "Oven ratatouille with feta", 2, 50, [(AUBERGINE, 200), (ZUCCHINI, 200), (PAPRIKA, 150), (TOMATEN, 200), (ZWIEBEL, 60), (FETA, 120), (OLIVENOEL, 15), (KRAEUTER, 8), (SALZ, 2)],
     [("Backofen auf 200 °C vorheizen.", "Preheat the oven to 200 °C."),
      ("Gemüse in Stücke schneiden, mit Öl, Kräutern, Salz und Pfeffer mischen und in einer Form 30 Minuten backen.", "Cut the vegetables into pieces, toss with oil, herbs, salt and pepper and bake in a dish for 30 min."),
      ("Feta darüberbröseln und weitere 10 Minuten backen.", "Crumble the feta over and bake for another 10 min.")]),
    ("Hähnchen-Gyros aus dem Ofen mit Tzatziki", "Oven chicken gyros with tzatziki", 1, 35, [(HAEHNCHEN, 160), (ZWIEBEL, 60), (GRJOG, 120), (GURKE, 80), (KNOBLAUCH, 3), (WRAP, 1), (OLIVENOEL, 8), (GEWUERZE, 4), (SALZ, 1)],
     [("Backofen auf 220 °C vorheizen.", "Preheat the oven to 220 °C."),
      ("Hähnchen in Streifen schneiden, mit Öl, Gewürzen und Zwiebelringen mischen und auf dem Blech 18 Minuten rösten.", "Cut the chicken into strips, toss with oil, spices and onion rings and roast on the tray for 18 min."),
      ("Für das Tzatziki Gurke raspeln, ausdrücken und mit Joghurt und Knoblauch verrühren.", "For the tzatziki grate the cucumber, squeeze out and mix with the yoghurt and garlic."),
      ("Gyros mit Tzatziki im warmen Wrap servieren.", "Serve the gyros with tzatziki in a warm wrap.")]),
    ("Lachs-Spinat-Lasagne", "Salmon and spinach lasagne", 3, 60, [(VKNUDELN, 180), (LACHS, 300), (SPINAT, 400), (ZWIEBEL, 60), (MILCH, 400), (STAERKE, 25), (REIBEKAESE, 60), (GEWUERZE, 3), (SALZ, 2)],
     [("Backofen auf 190 °C vorheizen. Vollkornnudeln (Lasagneplatten) bereitlegen.", "Preheat the oven to 190 °C. Have the wholegrain lasagne sheets ready."),
      ("Zwiebel andünsten, Spinat zugeben und zusammenfallen lassen. Lachs würfeln.", "Sauté the onion, add the spinach and let it wilt. Dice the salmon."),
      ("Milch mit Stärke verrühren, aufkochen, bis sie andickt, und würzen.", "Mix the milk with the cornflour, bring to the boil until thickened and season."),
      ("Platten, Spinat, Lachs und Sauce in eine Form schichten, mit Käse abschließen und 35 Minuten backen.", "Layer the sheets, spinach, salmon and sauce in a dish, finish with cheese and bake for 35 min.")]),
    ("Kürbis-Kichererbsen vom Blech mit Joghurt", "Sheet-pan squash and chickpeas with yoghurt", 1, 40, [(HOKKAIDO, 300), (KICHERERBSEN, 150), (ROTEZWIEBEL, 50), (OLIVENOEL, 10), (GEWUERZE, 3), (JOGHURT, 100), (KRAEUTER, 5), (SALZ, 1)],
     [("Backofen auf 200 °C vorheizen.", "Preheat the oven to 200 °C."),
      ("Kürbis in Spalten schneiden, mit Kichererbsen, Zwiebel, Öl und Gewürzen mischen und 30 Minuten rösten.", "Cut the squash into wedges, toss with the chickpeas, onion, oil and spices and roast for 30 min."),
      ("Mit Joghurt und Kräutern servieren.", "Serve with yoghurt and herbs.")]),
    ("Schweinefilet im Speckmantel light mit Ofengemüse", "Lean bacon-wrapped pork tenderloin with roasted vegetables", 2, 45, [(SCHWEINEFILET, 320), (SCHINKEN, 60), (KAROTTEN, 200), (KARTOFFELN, 400), (ZWIEBEL, 80), (OLIVENOEL, 12), (KRAEUTER, 8), (SALZ, 2)],
     [("Backofen auf 200 °C vorheizen. Kartoffeln und Karotten in Stücke schneiden, mit Öl und Kräutern mischen und 15 Minuten vorbacken.", "Preheat the oven to 200 °C. Cut the potatoes and carrots into pieces, toss with oil and herbs and pre-bake for 15 min."),
      ("Schweinefilet würzen, mit Kochschinken umwickeln und rundum kurz anbraten.", "Season the pork, wrap in the ham and sear briefly all over."),
      ("Filet auf das Gemüse legen und 20 Minuten garen, 5 Minuten ruhen lassen und aufschneiden.", "Place the pork on the vegetables and cook for 20 min, rest for 5 min and slice.")]),
]:
    R(de, en, "ofen", z, t, [(i, m, ST if i == EI else G) for i, m in ing], st)

# =====================================================================
# 2) SHAKES & SMOOTHIES (90)
# =====================================================================
FLAV = [  # de, en, Frucht-Zutaten
    ("Mango-Ananas", "mango-pineapple", [(MANGO, 80), (ANANAS, 60)]),
    ("Erdbeer-Banane", "strawberry-banana", [(ERDBEEREN, 100), (BANANE, 60)]),
    ("Heidelbeer-Hafer", "blueberry-oat", [(HEIDEL, 80), (HAFER, 20)]),
    ("Himbeer-Vanille", "raspberry-vanilla", [(HIMBEEREN, 100), (VANILLE, 2)]),
    ("Schoko-Erdnuss", "chocolate-peanut", [(KAKAO, 10), (ERDNUSSMUS, 15)]),
    ("Kirsch-Schoko", "cherry-chocolate", [(KIRSCHEN, 100), (KAKAO, 8)]),
    ("Apfel-Zimt", "apple-cinnamon", [(APFEL, 120), (ZIMT, 2)]),
    ("Pfirsich-Mango", "peach-mango", [(PFIRSICH, 120), (MANGO, 50)]),
    ("Kiwi-Spinat", "kiwi-spinach", [(KIWI, 100), (SPINAT, 40)]),
    ("Birne-Ingwer", "pear-ginger", [(BIRNE, 130), (INGWER, 5)]),
    ("Mandel-Dattel", "almond-date", [(MANDELMUS, 15), (DATTELN, 20)]),
    ("Kokos-Ananas", "coconut-pineapple", [(KOKOSRASPEL, 8), (ANANAS, 100)]),
    ("Beeren-Chia", "berry-chia", [(BEEREN, 120), (CHIA, 10)]),
    ("Bananen-Zimt", "banana-cinnamon", [(BANANE, 110), (ZIMT, 2)]),
    ("Orangen-Karotte", "orange-carrot", [(ORANGE, 150), (KAROTTEN, 60), (INGWER, 3)]),
]
ARTEN = [  # Titel-Muster de, en, Basis-Zutaten
    ("{f}-Proteinshake", "{F} protein shake", [(MILCH, 300, ML), (WHEY, 30, G)]),
    ("Veganer {f}-Shake", "Vegan {f} shake", [(MANDELDRINK, 300, ML), (ERBSENPROTEIN, 30, G)]),
    ("{f}-Skyr-Smoothie", "{F} skyr smoothie", [(SKYR, 200, G), (WASSER, 100, ML)]),
    ("{f}-Quark-Shake", "{F} quark shake", [(QUARK, 150, G), (MILCH, 200, ML)]),
    ("{f}-Hafer-Shake (Masseaufbau)", "{F} oat shake (mass gain)", [(MILCH, 350, ML), (HAFER, 50, G), (WHEY, 30, G), (ERDNUSSMUS, 15, G)]),
    ("{f}-Smoothie light", "Light {f} smoothie", [(WASSER, 150, ML), (JOGHURT, 150, G)]),
]
for (fde, fen, fz), (ade, aen, az) in itertools.product(FLAV, ARTEN):
    Fen = fen[0].upper() + fen[1:]
    de = ade.format(f=fde); en = aen.format(f=fen, F=Fen)
    if en.startswith("{"): en = en
    ing = list(az) + [(z, m, G) for z, m in fz if not any(z == a[0] for a in az)]
    ing = [(z, m, u) for z, m, u in ing]
    R(de, en, "shake", 1, 5 if "Hafer" in ade else 3, ing, [
        ("Obst waschen, schälen und grob schneiden (TK-Obst direkt verwenden).", "Wash, peel and roughly chop the fruit (use frozen fruit straight away)."),
        ("Alle Zutaten in einen Mixer geben und 30–60 Sekunden cremig mixen.", "Put all the ingredients in a blender and blend for 30–60 seconds until creamy."),
        ("Nach Belieben mit Eiswürfeln oder etwas mehr Flüssigkeit anpassen und sofort servieren.", "Adjust with ice cubes or a little more liquid as you like and serve immediately."),
    ], salz=False)

# =====================================================================
# 3) SALATE (100)
# =====================================================================
BASIS = [  # de, en, Zutaten, Vorbereitung de/en, Dauer
    ("Blattsalat", "leaf salad", [(BLATTSALAT, 120), (GURKE, 80), (CHERRY, 80)], None, 0),
    ("Rucola", "rocket", [(RUCOLA, 60), (CHERRY, 100), (PARMESAN, 10)], None, 0),
    ("Feldsalat", "lamb's lettuce", [(FELDSALAT, 70), (ROTEBETE, 80), (WALNUSS, 10)], None, 0),
    ("Spinat", "spinach", [(SPINAT, 80), (CHAMPIGNONS, 80), (ROTEZWIEBEL, 30)], None, 0),
    ("Quinoa", "quinoa", [(QUINOA, 55), (GURKE, 80), (PAPRIKA, 80)], ("Quinoa nach Packungsangabe garen und abkühlen lassen.", "Cook the quinoa according to the packet and leave to cool."), 15),
    ("Bulgur", "bulgur", [(BULGUR, 55), (TOMATEN, 100), (PETERSILIE, 15)], ("Bulgur mit kochendem Wasser übergießen und 10 Minuten quellen lassen.", "Pour boiling water over the bulgur and leave to swell for 10 min."), 12),
    ("Couscous", "couscous", [(COUSCOUS, 55), (PAPRIKA, 80), (FRUEHLINGSZW, 20)], ("Couscous mit kochender Brühe übergießen und 5 Minuten quellen lassen, dann auflockern.", "Pour boiling stock over the couscous, leave for 5 min, then fluff up."), 8),
    ("Linsen", "lentil", [(BERGLINSEN, 50), (KAROTTEN, 60), (SELLERIE, 40)], ("Linsen in Wasser 20 Minuten bissfest kochen und abtropfen lassen.", "Cook the lentils in water for 20 min until al dente and drain."), 25),
    ("Kartoffel", "potato", [(KARTOFFELN, 220), (GURKE, 80), (FRUEHLINGSZW, 20)], ("Kartoffeln in der Schale 20 Minuten kochen, pellen und in Scheiben schneiden.", "Boil the potatoes in their skins for 20 min, peel and slice."), 25),
    ("Nudel", "pasta", [(VKNUDELN, 60), (CHERRY, 80), (RUCOLA, 25)], ("Vollkornnudeln nach Packungsangabe bissfest kochen, abschrecken und abkühlen lassen.", "Cook the wholegrain pasta until al dente, rinse under cold water and leave to cool."), 15),
]
PROT_S = [  # de (mit ...), en, Zutaten, Zubereitung
    ("Hähnchen", "chicken", [(HAEHNCHEN, 130)], ("Hähnchenbrust würzen und in einer Pfanne mit wenig Öl von jeder Seite 5–6 Minuten braten, dann in Streifen schneiden.", "Season the chicken breast and fry in a little oil for 5–6 min each side, then slice.")),
    ("Putenstreifen", "turkey strips", [(PUTE, 130)], ("Putenbrust in Streifen schneiden, würzen und 5 Minuten rundum anbraten.", "Cut the turkey into strips, season and fry all over for 5 min.")),
    ("Thunfisch", "tuna", [(THUNFISCH, 110)], ("Thunfisch abtropfen lassen und zerpflücken.", "Drain the tuna and flake it.")),
    ("Räucherlachs", "smoked salmon", [(RAEUCHERLACHS, 80)], ("Räucherlachs in Streifen schneiden.", "Cut the smoked salmon into strips.")),
    ("Garnelen", "prawns", [(GARNELEN, 130)], ("Garnelen mit Knoblauch in wenig Öl 3–4 Minuten braten.", "Fry the prawns with garlic in a little oil for 3–4 min.")),
    ("Ei", "egg", [(EI, 2)], ("Eier 9 Minuten hart kochen, abschrecken, pellen und vierteln.", "Hard-boil the eggs for 9 min, cool, peel and quarter.")),
    ("Feta", "feta", [(FETA, 70)], ("Feta in Würfel schneiden oder zerbröseln.", "Dice or crumble the feta.")),
    ("Mozzarella", "mozzarella", [(MOZZARELLA, 100)], ("Mozzarella in Stücke zupfen.", "Tear the mozzarella into pieces.")),
    ("Kichererbsen", "chickpeas", [(KICHERERBSEN, 140)], ("Kichererbsen abspülen und mit etwas Paprikapulver in einer Pfanne 5 Minuten rösten.", "Rinse the chickpeas and toast in a pan with a little paprika for 5 min.")),
    ("Tofu", "tofu", [(TOFU, 150)], ("Tofu würfeln und in wenig Öl knusprig braten, mit Sojasauce ablöschen.", "Dice the tofu, fry in a little oil until crisp and deglaze with soy sauce.")),
]
DRESS = {  # Name de/en, Zutaten
    "bal": ("Balsamico-Dressing", "balsamic dressing", [(BALSAMICO, 10), (OLIVENOEL, 10), (SENF, 3)], "Balsamico, Olivenöl und Senf verrühren und würzen.", "Whisk the balsamic, olive oil and mustard and season."),
    "sh": ("Senf-Honig-Dressing", "honey-mustard dressing", [(SENF, 8), (HONIG, 6), (OLIVENOEL, 8), (ESSIG, 8)], "Senf, Honig, Essig und Öl verrühren und würzen.", "Whisk the mustard, honey, vinegar and oil and season."),
    "jk": ("Joghurt-Kräuter-Dressing", "yoghurt herb dressing", [(JOGHURT, 60), (KRAEUTER, 8), (ZITRONE, 8)], "Joghurt mit Kräutern und Zitronensaft verrühren und würzen.", "Mix the yoghurt with the herbs and lemon juice and season."),
    "zo": ("Zitronen-Olivenöl", "lemon and olive oil", [(ZITRONE, 15), (OLIVENOEL, 10)], "Zitronensaft und Olivenöl verrühren und würzen.", "Whisk the lemon juice and olive oil and season."),
    "as": ("Sesam-Soja-Dressing", "sesame soy dressing", [(SOJASAUCE, 12), (SESAMOEL, 5), (LIMETTE, 10), (SESAM, 5)], "Sojasauce, Sesamöl und Limettensaft verrühren, Sesam darüberstreuen.", "Whisk the soy sauce, sesame oil and lime juice and sprinkle with sesame."),
}
def dress_for(b, p):
    if p in ("Tofu", "Garnelen") and b in ("Blattsalat", "Spinat", "Quinoa", "Nudel", "Couscous"): return "as"
    if b in ("Kartoffel",) or p in ("Räucherlachs", "Thunfisch", "Ei"): return "jk"
    if b in ("Feldsalat", "Spinat", "Linsen"): return "sh"
    if b in ("Rucola", "Nudel", "Blattsalat") or p in ("Mozzarella",): return "bal"
    return "zo"
for (bde, ben, bz, bv, bt), (pde, pen, pz, pv) in itertools.product(BASIS, PROT_S):
    dk = dress_for(bde, pde); dde, den, dz, dst, dsten = DRESS[dk]
    de = f"{bde}salat mit {pde}" if bde not in ("Blattsalat",) else f"Bunter Salat mit {pde}"
    en = f"{ben[0].upper()+ben[1:]} salad with {pen}" if bde != "Blattsalat" else f"Mixed salad with {pen}"
    if bde == "Linsen": de = f"Linsensalat mit {pde}"
    if bde in ("Rucola", "Feldsalat", "Spinat"): de = f"{bde}-Salat mit {pde}"
    ing = [(z, m, G) for z, m in bz] + [(z, m, ST if z == EI else G) for z, m in pz] + [(z, m, G) for z, m in dz] + [(SALZ, 1, G)]
    if pde in ("Hähnchen", "Putenstreifen", "Garnelen", "Tofu"): ing.append((OLIVENOEL, 5, G))
    st = ([bv] if bv else []) + [pv, ("Gemüse waschen und klein schneiden, Blätter gegebenenfalls zupfen.", "Wash and chop the vegetables and tear any leaves."), (dst, dsten),
                                 ("Alles in einer Schüssel mischen, mit dem Dressing anmachen und mit Salz und Pfeffer abschmecken.", "Combine everything in a bowl, dress and season with salt and pepper.")]
    de = de.replace("Quinoasalat", "Quinoa-Salat").replace("Couscoussalat", "Couscous-Salat")
    R(de, en, "salat", 1, 10 + bt + (8 if pde in ("Hähnchen", "Putenstreifen", "Tofu", "Ei", "Garnelen", "Kichererbsen") else 0), ing, st)

# =====================================================================
# 4) DESSERTS & BACKEN (90)
# =====================================================================
def D_(de, en, z, t, ing, st): R(de, en, "dessert", z, t, ing, st, salz=False)
for fde, fen, fz in [("Erdbeer", "Strawberry", [(ERDBEEREN, 150)]), ("Mango", "Mango", [(MANGO, 150)]), ("Himbeer", "Raspberry", [(HIMBEEREN, 150)]),
                     ("Schoko-Kirsch", "Chocolate-cherry", [(KIRSCHEN, 120), (KAKAO, 8)]), ("Heidelbeer", "Blueberry", [(HEIDEL, 150)]), ("Pfirsich-Vanille", "Peach-vanilla", [(PFIRSICH, 150), (VANILLE, 2)])]:
    D_(f"{fde}-Nicecream mit Banane", f"{fen} banana nice cream", 1, 5, [(BANANE, 120, G)] + [(z, m, G) for z, m in fz] + [(SKYR, 80, G)], [
        ("Banane in Scheiben schneiden und zusammen mit dem Obst mindestens 4 Stunden einfrieren (TK-Obst direkt verwenden).", "Slice the banana and freeze with the fruit for at least 4 hours (use frozen fruit straight away)."),
        ("Gefrorenes Obst mit Skyr im Mixer cremig pürieren, dabei zwischendurch nach unten schieben.", "Blend the frozen fruit with the skyr until creamy, scraping down in between."),
        ("Sofort als Softeis servieren.", "Serve immediately like soft-serve.")])
for bde, ben, bid in [("Quark", "Quark", QUARK), ("Skyr", "Skyr", SKYR)]:
    for fde, fen, fz, top in [("Beeren", "berry", [(BEEREN, 100)], (HAFER, 15)), ("Mango-Kokos", "mango-coconut", [(MANGO, 100), (KOKOSRASPEL, 5)], (MANDELN, 8)),
                              ("Kirsch-Schoko", "cherry-chocolate", [(KIRSCHEN, 100), (KAKAO, 5)], (ZARTBITTER, 8)), ("Apfel-Zimt", "apple-cinnamon", [(APFELMUS, 100), (ZIMT, 2)], (WALNUSS, 10))]:
        D_(f"{bde}-{fde}-Creme im Glas", f"{fen[0].upper()+fen[1:]} {ben.lower()} cream in a glass", 1, 5, [(bid, 200, G), (ERYTHRIT, 8, G)] + [(z, m, G) for z, m in fz] + [(top[0], top[1], G)], [
            (f"{bde} mit Erythrit glatt rühren.", f"Stir the {ben.lower()} with the erythritol until smooth."),
            ("Abwechselnd mit dem Obst in ein Glas schichten.", "Layer in a glass, alternating with the fruit."),
            ("Mit dem Topping bestreuen und servieren oder bis zu einem Tag kalt stellen.", "Sprinkle with the topping and serve, or chill for up to a day.")])
MUF = [("Heidelbeer", "Blueberry", [(HEIDEL, 150)]), ("Schoko", "Chocolate", [(KAKAO, 25), (ZARTBITTER, 30)]), ("Apfel-Zimt", "Apple-cinnamon", [(APFEL, 200), (ZIMT, 4)]),
       ("Bananen-Walnuss", "Banana-walnut", [(BANANE, 150), (WALNUSS, 30)]), ("Himbeer", "Raspberry", [(HIMBEEREN, 150)]), ("Karotten", "Carrot cake", [(KAROTTEN, 180), (ZIMT, 4), (WALNUSS, 20)])]
for fde, fen, fz in MUF:
    D_(f"{fde}-Protein-Muffins (12 Stk.)", f"{fen} protein muffins (12 pcs)", 12, 35, [(HAFER, 150, G), (WHEY, 60, G), (QUARK, 250, G), (EI, 2, ST), (MILCH, 100, ML), (ERYTHRIT, 50, G), (BACKPULVER, 10, G)] + [(z, m, G) for z, m in fz], [
        ("Backofen auf 180 °C Ober-/Unterhitze vorheizen und ein Muffinblech fetten oder mit Förmchen auslegen.", "Preheat the oven to 180 °C (top and bottom heat) and grease or line a muffin tin."),
        ("Haferflocken fein mahlen und mit Proteinpulver, Erythrit und Backpulver mischen.", "Finely grind the oats and mix with the protein powder, erythritol and baking powder."),
        ("Quark, Eier und Milch verrühren, die trockenen Zutaten unterheben und Obst bzw. Nüsse (klein geschnitten) unterziehen.", "Mix the quark, eggs and milk, fold in the dry ingredients and then the chopped fruit or nuts."),
        ("Teig auf 12 Mulden verteilen und 20–22 Minuten backen (Stäbchenprobe).", "Divide the batter between 12 holes and bake for 20–22 min (skewer test).")])
for fde, fen, fz in [("Schoko", "Chocolate", [(KAKAO, 10)]), ("Vanille-Beeren", "Vanilla berry", [(BEEREN, 50), (VANILLE, 2)]), ("Erdnuss", "Peanut butter", [(ERDNUSSMUS, 12)]),
                     ("Apfel-Zimt", "Apple-cinnamon", [(APFELMUS, 50), (ZIMT, 2)]), ("Bananen", "Banana", [(BANANE, 60)]), ("Zitronen", "Lemon", [(ZITRONE, 10)])]:
    D_(f"{fde}-Mug-Cake mit Protein", f"{fen} protein mug cake", 1, 5, [(HAFER, 30, G), (WHEY, 25, G), (EI, 1, ST), (MILCH, 40, ML), (BACKPULVER, 3, G), (ERYTHRIT, 6, G)] + [(z, m, G) for z, m in fz], [
        ("Haferflocken fein mahlen und mit allen übrigen Zutaten in einer großen Tasse glatt verrühren.", "Finely grind the oats and stir with all the other ingredients in a large mug until smooth."),
        ("In der Mikrowelle bei 800 Watt 70–90 Sekunden garen, bis der Kuchen aufgegangen ist.", "Microwave at 800 W for 70–90 seconds until risen."),
        ("Kurz abkühlen lassen und direkt aus der Tasse essen.", "Leave to cool briefly and eat straight from the mug.")])
for fde, fen, fz in [("Mango", "Mango", [(MANGO, 100)]), ("Beeren", "Berry", [(BEEREN, 100)]), ("Schoko", "Chocolate", [(KAKAO, 8)]), ("Kokos", "Coconut", [(KOKOSRASPEL, 8), (ANANAS, 60)]), ("Kirsch", "Cherry", [(KIRSCHEN, 100)]), ("Apfel-Zimt", "Apple-cinnamon", [(APFEL, 100), (ZIMT, 2)])]:
    D_(f"{fde}-Chia-Pudding mit Skyr", f"{fen} chia pudding with skyr", 1, 5, [(CHIA, 25, G), (MANDELDRINK, 150, ML), (SKYR, 100, G), (ERYTHRIT, 5, G)] + [(z, m, G) for z, m in fz], [
        ("Chiasamen mit Mandeldrink und Erythrit verrühren, nach 5 Minuten noch einmal umrühren.", "Stir the chia seeds with the almond drink and erythritol, stir again after 5 min."),
        ("Mindestens 3 Stunden oder über Nacht kalt stellen.", "Chill for at least 3 hours or overnight."),
        ("Skyr unterziehen und mit dem Obst bzw. den übrigen Zutaten servieren.", "Fold in the skyr and serve with the fruit or remaining ingredients.")])
for fde, fen, fz in [("Schoko", "Chocolate", [(KAKAO, 12)]), ("Vanille", "Vanilla", [(VANILLE, 3)]), ("Erdbeer", "Strawberry", [(ERDBEEREN, 100)]), ("Karamell-Banane", "Caramel banana", [(BANANE, 80), (AHORN, 5)]), ("Kokos", "Coconut", [(KOKOSRASPEL, 8)]), ("Zimt", "Cinnamon", [(ZIMT, 3)])]:
    D_(f"{fde}-Proteinpudding", f"{fen} protein pudding", 2, 15, [(MILCH, 400, ML), (STAERKE, 30, G), (WHEY, 40, G), (ERYTHRIT, 15, G)] + [(z, m * 2, G) for z, m in fz], [
        ("Speisestärke mit etwas kalter Milch glatt rühren.", "Mix the cornflour with a little cold milk until smooth."),
        ("Restliche Milch mit Erythrit (und Kakao bzw. Gewürzen) aufkochen, Stärke einrühren und 1 Minute unter Rühren köcheln lassen.", "Bring the remaining milk to the boil with the erythritol (and cocoa or spices), stir in the cornflour and simmer for 1 min, stirring."),
        ("Vom Herd nehmen, kurz abkühlen lassen und das Proteinpulver einrühren.", "Remove from the heat, cool briefly and stir in the protein powder."),
        ("In Gläser füllen, mit Obst toppen und mindestens 2 Stunden kalt stellen.", "Pour into glasses, top with fruit and chill for at least 2 hours.")])
for ode, oen, oid in [("Apfel", "apples", APFEL), ("Birne", "pears", BIRNE), ("Pfirsich", "peaches", PFIRSICH)]:
    for tde, ten, tz in [("Hafer-Crunch", "oat crunch", [(HAFER, 25), (BUTTER, 5)]), ("Walnüssen & Zimt", "walnuts & cinnamon", [(WALNUSS, 15), (ZIMT, 2)]), ("Skyr-Vanille-Creme", "skyr vanilla cream", [(SKYR, 100), (VANILLE, 2)])]:
        D_(f"Gebackene {ode if oid != APFEL else 'Äpfel'} mit {tde}".replace("Gebackene Birne", "Gebackene Birnen").replace("Gebackene Pfirsich", "Gebackene Pfirsiche"), f"Baked {oen} with {ten}", 1, 30, [(oid, 2, ST), (HONIG, 8, G)] + [(z, m, G) for z, m in tz], [
            ("Backofen auf 180 °C vorheizen.", "Preheat the oven to 180 °C."),
            ("Obst halbieren, Kerngehäuse bzw. Stein entfernen und mit der Schnittfläche nach oben in eine Form legen. Mit Honig beträufeln.", "Halve the fruit, remove the core or stone and place cut side up in a dish. Drizzle with honey."),
            ("20 Minuten backen, bis das Obst weich ist (Crunch und Nüsse die letzten 8 Minuten mitbacken).", "Bake for 20 min until soft (bake the crunch or nuts for the last 8 min)."),
            ("Warm mit dem Topping servieren.", "Serve warm with the topping.")])
for fde, fen, fz in [("Schoko-Erdnuss", "Chocolate peanut", [(ERDNUSSMUS, 60), (KAKAO, 15)]), ("Kokos-Mandel", "Coconut almond", [(KOKOSRASPEL, 30), (MANDELMUS, 50)]), ("Dattel-Cashew", "Date cashew", [(DATTELN, 80), (CASHEW, 60)]),
                     ("Zimtschnecken", "Cinnamon roll", [(ZIMT, 6), (MANDELMUS, 50)]), ("Himbeer-Kokos", "Raspberry coconut", [(HIMBEEREN, 40), (KOKOSRASPEL, 30), (MANDELMUS, 40)]), ("Espresso-Schoko", "Mocha", [(KAKAO, 15), (ERDNUSSMUS, 50)])]:
    D_(f"{fde}-Proteinkugeln (12 Stk.)", f"{fen} protein balls (12 pcs)", 12, 15, [(HAFER, 100, G), (WHEY, 60, G), (HONIG, 30, G), (MILCH, 40, ML)] + [(z, m, G) for z, m in fz], [
        ("Haferflocken fein mahlen und mit allen übrigen Zutaten zu einem formbaren Teig verkneten (bei Bedarf etwas mehr Milch zugeben).", "Finely grind the oats and knead with all the other ingredients into a firm dough (add a little more milk if needed)."),
        ("Mit feuchten Händen 12 Kugeln formen.", "With damp hands shape into 12 balls."),
        ("Mindestens 30 Minuten kalt stellen. Hält sich gekühlt 5 Tage.", "Chill for at least 30 min. Keeps in the fridge for 5 days.")])
for fde, fen, fz in [("Beeren", "Berry", [(BEEREN, 200)]), ("Mango-Maracuja", "Mango", [(MANGO, 200)]), ("Schoko-Banane", "Chocolate banana", [(BANANE, 150), (KAKAO, 15)]),
                     ("Erdbeer", "Strawberry", [(ERDBEEREN, 200)]), ("Pfirsich", "Peach", [(PFIRSICH, 200)]), ("Kirsch", "Cherry", [(KIRSCHEN, 200)])]:
    D_(f"{fde}-Joghurt-Eis am Stiel (6 Stk.)".replace("Mango-Maracuja", "Mango"), f"{fen} frozen yoghurt lollies (6 pcs)", 6, 10, [(GRJOG, 400, G), (HONIG, 30, G)] + [(z, m, G) for z, m in fz], [
        ("Obst pürieren bzw. klein schneiden und mit Joghurt und Honig verrühren.", "Purée or finely chop the fruit and mix with the yoghurt and honey."),
        ("In 6 Eisformen füllen, Stiele hineinstecken.", "Pour into 6 lolly moulds and insert the sticks."),
        ("Mindestens 5 Stunden einfrieren. Zum Lösen kurz unter warmes Wasser halten.", "Freeze for at least 5 hours. Dip briefly in warm water to release.")])
for fde, fen, fz in [("Rhabarber-Erdbeer", "Strawberry", [(ERDBEEREN, 250)]), ("Beeren", "Berry", [(BEEREN, 250)]), ("Birnen-Ingwer", "Pear-ginger", [(BIRNE, 250), (INGWER, 5)]),
                     ("Pfirsich", "Peach", [(PFIRSICH, 250)]), ("Kirsch", "Cherry", [(KIRSCHEN, 250)]), ("Mango-Kokos", "Mango-coconut", [(MANGO, 220), (KOKOSRASPEL, 10)])]:
    D_(f"{fde}-Crumble mit Haferflocken".replace("Rhabarber-Erdbeer", "Erdbeer"), f"{fen} oat crumble", 2, 35, [(HAFER, 60, G), (BUTTER, 20, G), (ERYTHRIT, 15, G), (ZIMT, 2, G), (SKYR, 150, G)] + [(z, m, G) for z, m in fz], [
        ("Backofen auf 190 °C vorheizen.", "Preheat the oven to 190 °C."),
        ("Obst klein schneiden und in eine kleine Auflaufform geben.", "Chop the fruit and place in a small baking dish."),
        ("Haferflocken, Butter, Erythrit und Zimt zu Streuseln verreiben und über das Obst geben.", "Rub the oats, butter, erythritol and cinnamon into a crumble and scatter over the fruit."),
        ("25 Minuten goldbraun backen und mit Skyr servieren.", "Bake for 25 min until golden and serve with skyr.")])
for fde, fen, fz in [("Schoko", "Chocolate", [(ZARTBITTER, 40)]), ("Heidelbeer", "Blueberry", [(HEIDEL, 120)]), ("Walnuss", "Walnut", [(WALNUSS, 50)]), ("Erdnuss", "Peanut", [(ERDNUSSMUS, 50)]), ("Kokos", "Coconut", [(KOKOSRASPEL, 30)])]:
    D_(f"{fde}-Bananenbrot mit Protein (10 Scheiben)", f"{fen} protein banana bread (10 slices)", 10, 65, [(BANANE, 300, G), (HAFER, 150, G), (WHEY, 50, G), (EI, 2, ST), (SKYR, 150, G), (BACKPULVER, 10, G), (ZIMT, 3, G)] + [(z, m, G) for z, m in fz], [
        ("Backofen auf 175 °C vorheizen und eine Kastenform mit Backpapier auslegen.", "Preheat the oven to 175 °C and line a loaf tin with baking paper."),
        ("Bananen zerdrücken und mit Eiern und Skyr verrühren.", "Mash the bananas and mix with the eggs and skyr."),
        ("Gemahlene Haferflocken, Proteinpulver, Backpulver und Zimt unterrühren, dann die übrigen Zutaten unterheben.", "Stir in the ground oats, protein powder, baking powder and cinnamon, then fold in the remaining ingredients."),
        ("In die Form füllen und 45–50 Minuten backen (Stäbchenprobe). In der Form abkühlen lassen.", "Pour into the tin and bake for 45–50 min (skewer test). Leave to cool in the tin.")])
for fde, fen, fz in [("Mango", "Mango", [(MANGO, 150)]), ("Erdbeer", "Strawberry", [(ERDBEEREN, 150)]), ("Kokos", "Coconut", [(KOKOSMILCH, 150)]), ("Kaffee-Schoko", "Mocha", [(KAKAO, 10)])]:
    D_(f"{fde}-Panna-Cotta light (4 Gläser)", f"Light {fen.lower()} panna cotta (4 glasses)", 4, 20, [(MILCH, 300, ML), (GRJOG, 250, G), (GELATINE, 8, G), (ERYTHRIT, 30, G), (VANILLE, 3, G)] + [(z, m, G) for z, m in fz], [
        ("Gelatine nach Packungsangabe in kaltem Wasser einweichen.", "Soak the gelatine in cold water according to the packet."),
        ("Milch mit Erythrit und Vanille erwärmen (nicht kochen), Gelatine ausdrücken und darin auflösen.", "Warm the milk with the erythritol and vanilla (do not boil), squeeze out the gelatine and dissolve it in the milk."),
        ("Joghurt einrühren, in 4 Gläser füllen und mindestens 4 Stunden kalt stellen.", "Stir in the yoghurt, pour into 4 glasses and chill for at least 4 hours."),
        ("Vor dem Servieren mit dem Obst bzw. Topping belegen.", "Top with the fruit or topping before serving.")])
for fde, fen, fz in [("Himbeer", "Raspberry", [(HIMBEEREN, 200)]), ("Blaubeer", "Blueberry", [(HEIDEL, 200)]), ("Mandarinen-Orangen", "Orange", [(ORANGE, 250)]), ("Schoko", "Chocolate", [(KAKAO, 25)]), ("Zitronen", "Lemon", [(ZITRONE, 40)])]:
    D_(f"{fde}-Protein-Käsekuchen ohne Boden (12 Stücke)".replace("Mandarinen-Orangen", "Orangen"), f"{fen} crustless protein cheesecake (12 slices)", 12, 75, [(QUARK, 1000, G), (EI, 4, ST), (WHEY, 60, G), (STAERKE, 40, G), (ERYTHRIT, 100, G), (VANILLE, 5, G)] + [(z, m, G) for z, m in fz], [
        ("Backofen auf 170 °C Ober-/Unterhitze vorheizen und eine Springform (26 cm) mit Backpapier auslegen.", "Preheat the oven to 170 °C (top and bottom heat) and line a 26 cm springform tin with baking paper."),
        ("Quark, Eier, Proteinpulver, Stärke, Erythrit und Vanille glatt rühren.", "Beat the quark, eggs, protein powder, cornflour, erythritol and vanilla until smooth."),
        ("Obst bzw. Kakao oder Zitronensaft unterheben und die Masse in die Form füllen.", "Fold in the fruit, cocoa or lemon juice and pour the mixture into the tin."),
        ("60 Minuten backen, im ausgeschalteten Ofen bei leicht geöffneter Tür abkühlen lassen und über Nacht kalt stellen.", "Bake for 60 min, leave to cool in the switched-off oven with the door slightly open and chill overnight.")])
for fde, fen, fz in [("Schoko", "Chocolate", [(KAKAO, 15)]), ("Erdbeer", "Strawberry", [(ERDBEEREN, 120)]), ("Mango", "Mango", [(MANGO, 120)]), ("Erdnuss", "Peanut butter", [(ERDNUSSMUS, 15)]), ("Zitronen", "Lemon", [(ZITRONE, 15)])]:
    D_(f"{fde}-Quark-Mousse mit Protein", f"{fen} quark protein mousse", 1, 10, [(QUARK, 150, G), (EIKLAR, 60, G), (WHEY, 15, G), (ERYTHRIT, 8, G)] + [(z, m, G) for z, m in fz], [
        ("Eiklar mit einer Prise Salz steif schlagen.", "Whisk the egg white with a pinch of salt until stiff."),
        ("Quark mit Proteinpulver, Erythrit und den Geschmackszutaten glatt rühren (Obst vorher pürieren).", "Mix the quark with the protein powder, erythritol and flavourings until smooth (purée fruit first)."),
        ("Eischnee vorsichtig unterheben und mindestens 30 Minuten kalt stellen.", "Gently fold in the egg white and chill for at least 30 min.")])
for de, en, z, t, ing, st in [
    ("Haferkekse mit Erdnuss & Schoko (12 Stk.)", "Peanut chocolate oat cookies (12 pcs)", 12, 25, [(HAFER, 150, G), (ERDNUSSMUS, 60, G), (BANANE, 120, G), (ZARTBITTER, 40, G), (BACKPULVER, 5, G)],
     [("Backofen auf 180 °C vorheizen.", "Preheat the oven to 180 °C."), ("Banane zerdrücken und mit Erdnussmus, Haferflocken und Backpulver verkneten, gehackte Schokolade unterheben.", "Mash the banana and knead with the peanut butter, oats and baking powder, fold in the chopped chocolate."),
      ("12 flache Kekse auf ein Blech mit Backpapier setzen und 12–14 Minuten backen.", "Place 12 flat cookies on a lined tray and bake for 12–14 min.")]),
    ("Apfel-Zimt-Haferkekse (12 Stk.)", "Apple cinnamon oat cookies (12 pcs)", 12, 25, [(HAFER, 150, G), (APFELMUS, 120, G), (MANDELMUS, 40, G), (ZIMT, 4, G), (ROSINEN, 30, G), (BACKPULVER, 5, G)],
     [("Backofen auf 180 °C vorheizen.", "Preheat the oven to 180 °C."), ("Alle Zutaten zu einem klebrigen Teig verrühren und 10 Minuten quellen lassen.", "Mix all the ingredients into a sticky dough and leave to swell for 10 min."),
      ("12 flache Kekse auf ein Blech mit Backpapier setzen und 14–16 Minuten backen.", "Place 12 flat cookies on a lined tray and bake for 14–16 min.")]),
    ("Kokos-Haferkekse (12 Stk.)", "Coconut oat cookies (12 pcs)", 12, 25, [(HAFER, 130, G), (KOKOSRASPEL, 40, G), (BANANE, 120, G), (HONIG, 20, G), (EI, 1, ST), (BACKPULVER, 5, G)],
     [("Backofen auf 180 °C vorheizen.", "Preheat the oven to 180 °C."), ("Banane zerdrücken und mit allen übrigen Zutaten verkneten.", "Mash the banana and knead with all the other ingredients."),
      ("12 Kekse formen und 12–14 Minuten goldbraun backen.", "Shape 12 cookies and bake for 12–14 min until golden.")]),
]:
    D_(de, en, z, t, ing, st)

for de, en, z, t, ing, st in [
    ("Erdbeer-Tiramisu light im Glas", "Light strawberry tiramisu in a glass", 2, 15, [(QUARK, 250, G), (SKYR, 150, G), (ERDBEEREN, 200, G), (REISWAFFELN := 51, 4, ST), (KAKAO, 5, G), (ERYTHRIT, 20, G), (VANILLE, 3, G)],
     [("Quark, Skyr, Erythrit und Vanille glatt rühren.", "Beat the quark, skyr, erythritol and vanilla until smooth."), ("Erdbeeren klein schneiden, Reiswaffeln zerbröseln.", "Chop the strawberries and crumble the rice cakes."),
      ("Abwechselnd in zwei Gläser schichten, mit Kakao bestäuben und 1 Stunde kalt stellen.", "Layer in two glasses, dust with cocoa and chill for 1 hour.")]),
    ("Schoko-Avocado-Mousse mit Banane", "Chocolate avocado mousse with banana", 2, 10, [(AVOCADO, 150, G), (BANANE, 120, G), (KAKAO, 20, G), (SKYR, 150, G), (AHORN, 15, G)],
     [("Avocado, Banane, Kakao, Skyr und Ahornsirup im Mixer ganz glatt pürieren.", "Blend the avocado, banana, cocoa, skyr and maple syrup until completely smooth."),
      ("In zwei Schälchen füllen und mindestens 30 Minuten kalt stellen.", "Divide between two bowls and chill for at least 30 min.")]),
    ("Protein-Grießpudding mit Beeren", "Protein semolina pudding with berries", 1, 10, [(MILCH, 250, ML), (148, 30, G), (WHEY, 20, G), (ERYTHRIT, 8, G), (BEEREN, 100, G)],
     [("Milch mit Erythrit aufkochen, Maisgrieß einrühren und unter Rühren 4 Minuten köcheln lassen.", "Bring the milk to the boil with the erythritol, stir in the semolina and simmer for 4 min, stirring."),
      ("Vom Herd nehmen, kurz abkühlen lassen und das Proteinpulver einrühren.", "Remove from the heat, cool briefly and stir in the protein powder."),
      ("Mit den Beeren servieren, warm oder kalt.", "Serve with the berries, warm or cold.")]),
]:
    D_(de, en, z, t, ing, st)

# =====================================================================
# 5) VEGETARISCH (80)
# =====================================================================
def V_(de, en, z, t, ing, st): R(de, en, "veg", z, t, ing, st)
for (pde, pen, pz), (gde, gen, gz) in itertools.product(
        [("Kichererbsen", "Chickpea", [(KICHERERBSEN, 240)]), ("Linsen", "Lentil", [(ROTELINSEN, 100)]), ("Tofu", "Tofu", [(TOFU, 300)]), ("Bohnen", "Bean", [(WEISSEBOHNEN, 240)])],
        [("Spinat", "spinach", [(SPINAT, 200)]), ("Blumenkohl", "cauliflower", [(BLUMENKOHL, 300)]), ("Süßkartoffel", "sweet potato", [(SUESSKARTOFFEL, 250)]),
         ("Brokkoli", "broccoli", [(BROKKOLI, 250)]), ("Auberginen", "aubergine", [(AUBERGINE, 250)])]):
    ing = [(z, m, G) for z, m in pz + gz] + [(ZWIEBEL, 80, G), (KNOBLAUCH, 6, G), (INGWER, 10, G), (CURRYPASTE, 30, G), (KOKOSMILCH, 250, ML), (TOMDOSE, 200, G), (BASMATI, 140, G), (RAPSOEL, 8, G), (KORIANDER, 5, G), (SALZ, 2, G)]
    V_(f"{pde}-{gde}-Curry mit Reis", f"{pen} and {gen} curry with rice", 2, 35, ing, [
        ("Basmatireis nach Packungsangabe garen.", "Cook the basmati rice according to the packet."),
        ("Zwiebel, Knoblauch und Ingwer fein hacken und im Öl 3 Minuten andünsten. Currypaste zugeben und 1 Minute mitrösten.", "Finely chop the onion, garlic and ginger and sauté in the oil for 3 min. Add the curry paste and fry for 1 min."),
        (f"Gemüse klein schneiden, mit Kokosmilch und Tomaten zugeben und 10 Minuten köcheln lassen ({'Linsen dabei mitgaren' if pde == 'Linsen' else 'Tofu vorher würfeln und anbraten' if pde == 'Tofu' else 'Hülsenfrüchte abspülen und zugeben'}).",
         f"Chop the vegetables, add with the coconut milk and tomatoes and simmer for 10 min ({'cooking the lentils in it' if pde == 'Linsen' else 'dice and fry the tofu first' if pde == 'Tofu' else 'rinse the beans or chickpeas and add them'})."),
        ("Abschmecken und mit Reis und Koriander servieren.", "Season and serve with rice and coriander.")])
for (pde, pen, pz, pv), (bde, ben, bz, bv) in itertools.product(
        [("Feta", "feta", [(FETA, 70)], ("Feta in Würfel schneiden.", "Dice the feta.")), ("Tofu", "tofu", [(TOFU, 160)], ("Tofu würfeln und knusprig braten.", "Dice the tofu and fry until crisp.")),
         ("Tempeh", "tempeh", [(TEMPEH, 120)], ("Tempeh in Scheiben schneiden und mit Sojasauce braten.", "Slice the tempeh and fry with soy sauce.")), ("Falafel", "falafel", [(FALAFEL, 120)], ("Falafel im Ofen oder in der Pfanne erwärmen.", "Warm the falafel in the oven or a pan.")),
         ("Ei", "egg", [(EI, 2)], ("Eier 7 Minuten wachsweich kochen, abschrecken und halbieren.", "Boil the eggs for 7 min until jammy, cool and halve.")), ("Edamame", "edamame", [(EDAMAME, 120)], ("Edamame 3 Minuten in Salzwasser kochen.", "Cook the edamame in salted water for 3 min."))],
        [("Quinoa", "quinoa", [(QUINOA, 60)], "Quinoa nach Packungsangabe garen."), ("Bulgur", "bulgur", [(BULGUR, 60)], "Bulgur nach Packungsangabe garen."),
         ("Couscous", "couscous", [(COUSCOUS, 60)], "Couscous mit kochender Brühe übergießen und 5 Minuten quellen lassen."), ("Reis", "rice", [(BASMATI, 60)], "Reis nach Packungsangabe garen.")]):
    ing = [(z, m, G) for z, m in bz] + [(z, m, ST if z == EI else G) for z, m in pz] + [(GURKE, 80, G), (CHERRY, 80, G), (AVOCADO, 50, G), (HUMMUS, 30, G), (ZITRONE, 8, G), (SALZ, 1, G)]
    if pde in ("Tofu", "Tempeh"): ing.append((RAPSOEL, 5, G))
    V_(f"{pde}-Bowl mit {bde}", f"{pen[0].upper()+pen[1:]} bowl with {ben}", 1, 25, ing, [
        (bv, {"Quinoa": "Cook the quinoa according to the packet.", "Bulgur": "Cook the bulgur according to the packet.", "Couscous": "Pour boiling stock over the couscous and leave to swell for 5 min.", "Reis": "Cook the rice according to the packet."}[bde]),
        pv, ("Gurke, Tomaten und Avocado klein schneiden.", "Chop the cucumber, tomatoes and avocado."),
        ("Alles in einer Schüssel anrichten, mit Hummus und Zitronensaft toppen und würzen.", "Arrange everything in a bowl, top with hummus and lemon juice and season.")])
for de, en, extra in [("Klassische Shakshuka mit Vollkornbrot", "Classic shakshuka with wholegrain bread", []), ("Shakshuka mit Feta", "Shakshuka with feta", [(FETA, 50)]), ("Grüne Shakshuka mit Spinat", "Green shakshuka with spinach", [(SPINAT, 150)]),
                      ("Shakshuka mit Kichererbsen", "Shakshuka with chickpeas", [(KICHERERBSEN, 120)]), ("Shakshuka mit weißen Bohnen", "Shakshuka with white beans", [(WEISSEBOHNEN, 120)]), ("Shakshuka mit Zucchini", "Shakshuka with courgette", [(ZUCCHINI, 150)])]:
    V_(de, en, 1, 25, [(EI, 3, ST), (PAPRIKA, 120, G), (ZWIEBEL, 60, G), (KNOBLAUCH, 4, G), (TOMDOSE, 250, G), (GEWUERZE, 3, G), (OLIVENOEL, 8, G), (VKBROT, 1, ST)] + [(z, m, G) for z, m in extra] + [(SALZ, 1, G)], [
        ("Zwiebel, Knoblauch und Paprika klein schneiden und im Öl 5 Minuten andünsten (übriges Gemüse mitgaren).", "Chop the onion, garlic and pepper and sauté in the oil for 5 min (cook any other vegetables with them)."),
        ("Tomaten und Gewürze zugeben und 8 Minuten einköcheln lassen.", "Add the tomatoes and spices and simmer for 8 min."),
        ("Mulden in die Sauce drücken, Eier hineinschlagen und zugedeckt 6–8 Minuten stocken lassen.", "Make wells in the sauce, crack in the eggs and cook covered for 6–8 min until set."),
        ("Mit Brot servieren.", "Serve with bread.")])
for de, en, pz in [("Chili sin Carne mit Sojaschnetzeln", "Chili sin carne with soy mince", [(SOJASCHNETZEL, 60)]), ("Linsen-Chili sin Carne", "Lentil chili sin carne", [(ROTELINSEN, 80)]),
                   ("Drei-Bohnen-Chili", "Three-bean chili", [(SCHWBOHNEN, 120), (WEISSEBOHNEN, 100)]), ("Süßkartoffel-Chili", "Sweet potato chili", [(SUESSKARTOFFEL, 250)]), ("Quinoa-Chili", "Quinoa chili", [(QUINOA, 60)])]:
    V_(de, en, 2, 35, [(KIDNEY, 200, G), (MAIS, 100, G), (PAPRIKA, 150, G), (ZWIEBEL, 80, G), (KNOBLAUCH, 5, G), (TOMDOSE, 400, G), (TOMATENMARK, 20, G), (GEWUERZE, 6, G), (RAPSOEL, 8, G), (SAURESAHNE, 60, G)] + [(z, m, G) for z, m in pz] + [(SALZ, 2, G)], [
        ("Zwiebel, Knoblauch und Paprika würfeln und im Öl 5 Minuten anbraten. Tomatenmark und Gewürze kurz mitrösten.", "Dice the onion, garlic and pepper and fry in the oil for 5 min. Briefly fry the tomato paste and spices with them."),
        ("Tomaten, Bohnen, Mais und die übrigen Zutaten zugeben (Sojaschnetzel vorher in Brühe einweichen) und 20 Minuten köcheln lassen, bei Bedarf Wasser angießen.", "Add the tomatoes, beans, sweetcorn and remaining ingredients (soak soy mince in stock first) and simmer for 20 min, adding water if needed."),
        ("Abschmecken und mit saurer Sahne servieren.", "Season and serve with sour cream.")])
for (pde, pen, pz), (sde, sen, sz, sst, ssten) in itertools.product(
        [("Linsen", "Lentil", [(ROTELINSEN, 80)]), ("Kichererbsen", "Chickpea", [(KICHERERBSEN, 200)]), ("Haferflocken", "Oat", [(HAFER, 80), (REIBEKAESE, 30)]), ("Bohnen", "Bean", [(KIDNEY, 200)])],
        [("Ofenkartoffeln", "roast potatoes", [(KARTOFFELN, 300)], "Kartoffeln in Spalten schneiden, mit wenig Öl mischen und bei 200 °C 30 Minuten backen.", "Cut the potatoes into wedges, toss with a little oil and bake at 200 °C for 30 min."),
         ("Gurkensalat", "cucumber salad", [(GURKE, 200), (DILL, 3)], "Gurke in Scheiben hobeln und mit Dill, Salz und etwas Essig anmachen.", "Thinly slice the cucumber and dress with dill, salt and a little vinegar.")]):
    V_(f"{pde}-Bratlinge mit Joghurt-Dip und {sde}", f"{pen} patties with yoghurt dip and {sen}", 2, 40, [(z, m * 2 if z not in (DILL,) else m, G) for z, m in pz + sz] + [(EI, 1, ST), (ZWIEBEL, 50, G), (PANIER := 138, 30, G), (GEWUERZE, 4, G), (RAPSOEL, 12, G), (JOGHURT, 150, G), (KRAEUTER, 8, G), (SALZ, 2, G)], [
        (sst, ssten),
        ("Linsen gegebenenfalls 10 Minuten weich kochen. Hülsenfrüchte bzw. Haferflocken mit Ei, gehackter Zwiebel, Paniermehl und Gewürzen grob pürieren bzw. verkneten.", "Cook any lentils for 10 min until soft. Roughly mash or knead the pulses or oats with the egg, chopped onion, breadcrumbs and spices."),
        ("6 Bratlinge formen und im Öl von jeder Seite 3–4 Minuten goldbraun braten.", "Shape 6 patties and fry in the oil for 3–4 min each side until golden."),
        ("Joghurt mit Kräutern, Salz und Pfeffer verrühren und alles zusammen servieren.", "Mix the yoghurt with herbs, salt and pepper and serve everything together.")])
for (pde, pen, pz), (nde, nen, nz, nst, nsten) in itertools.product(
        [("Tofu", "tofu", [(TOFU, 180)]), ("Tempeh", "tempeh", [(TEMPEH, 140)]), ("Ei", "egg", [(EI, 2)])],
        [("Reisnudeln", "rice noodles", [(111, 70)], "Reisnudeln nach Packungsangabe einweichen bzw. garen.", "Soak or cook the rice noodles according to the packet."),
         ("Basmatireis", "basmati rice", [(BASMATI, 70)], "Basmatireis nach Packungsangabe garen.", "Cook the basmati rice according to the packet.")]):
    for sde, sen, sz in [("Erdnusssauce", "peanut sauce", [(ERDNUSSMUS, 20), (SOJASAUCE, 15), (LIMETTE, 10)]), ("Teriyaki-Art", "teriyaki style", [(SOJASAUCE, 20), (HONIG, 10), (INGWER, 5)])]:
        V_(f"{pde}-Gemüse-Pfanne mit {nde} ({sde})".replace("(Teriyaki-Art)", "nach Teriyaki-Art").replace(" (Erdnusssauce)", " und Erdnusssauce"),
           f"{pen[0].upper()+pen[1:]} stir-fry with {nen} ({sen})".replace(" (peanut sauce)", " and peanut sauce").replace(" (teriyaki style)", ", teriyaki style"), 1, 25,
           [(z, m, G) for z, m in nz] + [(z, m, ST if z == EI else G) for z, m in pz] + [(WOKGEMUESE, 200, G), (RAPSOEL, 8, G)] + [(z, m, G) for z, m in sz] + [(FRUEHLINGSZW, 15, G)], [
            (nst, nsten),
            ({"Tofu": "Tofu würfeln und im Öl rundum knusprig braten, herausnehmen.", "Tempeh": "Tempeh in Scheiben schneiden, im Öl anbraten und herausnehmen.", "Ei": "Eier verquirlen, im Öl stocken lassen, zerteilen und herausnehmen."}[pde],
             {"Tofu": "Dice the tofu, fry in the oil until crisp all over and remove.", "Tempeh": "Slice the tempeh, fry in the oil and remove.", "Ei": "Whisk the eggs, let them set in the oil, break up and remove."}[pde]),
            ("Wokgemüse 5–6 Minuten bei hoher Hitze braten.", "Stir-fry the vegetables over a high heat for 5–6 min."),
            ("Sauce verrühren, mit allem zurück in die Pfanne geben, kurz durchschwenken und mit Frühlingszwiebeln servieren.", "Mix the sauce, return everything to the pan, toss briefly and serve with spring onions.")])
for fde, fen, fz in [("schwarzen Bohnen & Salsa", "black beans & salsa", [(SCHWBOHNEN, 120), (SALSA, 60), (SAURESAHNE, 40)]), ("Feta & Spinat", "feta & spinach", [(FETA, 50), (SPINAT, 80)]),
                     ("Kichererbsen & Tahin", "chickpeas & tahini", [(KICHERERBSEN, 120), (TAHIN, 15)]), ("Hüttenkäse & Kräutern", "cottage cheese & herbs", [(HUETTENKAESE, 150), (KRAEUTER, 8)]),
                     ("Linsen & Joghurt", "lentils & yoghurt", [(ROTELINSEN, 40), (JOGHURT, 80)])]:
    V_(f"Gefüllte Ofen-Süßkartoffel mit {fde}", f"Baked sweet potato stuffed with {fen}", 1, 50, [(SUESSKARTOFFEL, 300, G)] + [(z, m, G) for z, m in fz] + [(OLIVENOEL, 5, G), (SALZ, 1, G)], [
        ("Backofen auf 200 °C vorheizen. Süßkartoffel waschen, mehrmals einstechen und 40–45 Minuten weich backen.", "Preheat the oven to 200 °C. Wash the sweet potato, prick several times and bake for 40–45 min until soft."),
        ("Inzwischen die Füllung vorbereiten (Linsen 10 Minuten weich kochen, Spinat kurz andünsten, Hülsenfrüchte erwärmen).", "Meanwhile prepare the filling (cook the lentils for 10 min, briefly wilt the spinach, warm the pulses)."),
        ("Süßkartoffel längs aufschneiden, etwas auseinanderdrücken, füllen und würzen.", "Slice the sweet potato open lengthways, press apart slightly, fill and season.")])

# ---------- Ausgabe ----------
json.dump(OUT, open(os.path.join(D, 'neu.json'), 'w'), ensure_ascii=False, indent=0)
from collections import Counter
print(len(OUT), Counter(r['cat'] for r in OUT))
