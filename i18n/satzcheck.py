import json,re,sys
inp=json.load(open('rez-sent.json'));out=json.load(open(sys.argv[1]))['sent']
FIX=[(r'\blye (stalks?|stems?|sticks?|rods?|bars?)\b','pretzel stick'),(r'\b[Pp]luck(ed)? (the |)(lettuce|salad|mozzarella|basil|herbs|rocket|parsley|coriander)','tear \\2\\3'),(r'\b[Pp]luck(ed)? (.{0,30}) with two forks','shred \\2 with two forks'),(r'\blet (it|them) collapse\b','let \\1 wilt'),(r'^Collapse\.$','Let it wilt.'),(r'\balmond paste\b','almond butter'),(r'\bpeanut paste\b','peanut butter'),(r'\berythrite\b','erythritol'),(r'\bchop with two forks\b','shred with two forks'),(r'\bmashed tomatoes\b','passata'),(r'\boatmeal\b','oats'),(r'\btomato paste\b','tomato purée'),(r'\bplastic wrap\b','cling film'),(r'\b(coated|non-greasy|nonstick) (pan|saucepan)\b','non-stick \\2'),(r'\bpopcorn corn\b','popcorn kernels'),(r'° C\b','°C'),(r'\byogurt\b','yoghurt'),(r'\bstuffing\b','filling'),(r'\bnoodles\b','pasta') if False else (r'\bpackage specifications\b','the packet instructions'),(r'\bliver cheese\b','Leberkäse'),(r'\blye (stems?|sticks?|rods?)\b','pretzel stick'),(r'\blugsticks?\b','pretzel stick'),(r'\blye rolls?\b','pretzel roll'),(r'\bEmmentaler\b','Emmental'),(r'\bgoat\'s fresh cheese\b','fresh goat\'s cheese'),(r'\bzucchinis\b','courgettes'),(r'\bzucchini\b','courgette'),(r'\beggplants?\b','aubergine'),(r'\bcilantro\b','coriander'),(r'\blean quark\b','low-fat quark'),
(r'\bincense tofu\b','smoked tofu'),(r'\bcattle\b','beef'),(r'\bscallions?\b','spring onions'),(r'\bgarbanzo beans\b','chickpeas'),(r'\bshrimps?\b','prawns'),(r'\bcookie sheet\b','baking tray'),
(r'\bbaking sheet\b','baking tray'),(r'\bstove\b','heat'),(r'\bcurd\b','quark'),(r'\bTL\b','tsp'),(r'\bEL\b','tbsp'),(r'\btablespoons?\b','tbsp'),(r'\bteaspoons?\b','tsp'),(r'\bminutes\b','min'),(r'\bminute\b','min')]
G={'Räuchertofu':'smoked tofu','Kabeljau':'cod','Seelachs':'pollock','Putenhack':'turkey','Rinderhack':'beef','Hähnchen':'chicken','Pute':'turkey','Lachs':'salmon','Garnelen':'prawn','Thunfisch':'tuna',
'Forelle':'trout','Brokkoli':'broccoli','Blumenkohl':'cauliflower','Spinat':'spinach','Möhre':'carrot','Karotte':'carrot','Süßkartoffel':'sweet potato','Kichererbsen':'chickpea','Linsen':'lentil',
'Quark':'quark','Skyr':'skyr','Haferflocken':'oat','Feta':'feta','Hüttenkäse':'cottage cheese','Frischkäse':'cream cheese','Joghurt':'yoghurt','Spargel':'asparagus','Lauch':'leek','Fenchel':'fennel',
'Kürbis':'pumpkin','Rote Bete':'beetroot','Pilz':'mushroom','Champignon':'mushroom','Tofu':'tofu','Tempeh':'tempeh','Schweinefilet':'pork','Schnitzel':'schnitzel','Gnocchi':'gnocchi','Ofen':'oven',
'Pfanne':'pan','Topf':'pot','dämpfen':'steam','Knoblauch':'garlic','Zwiebel':'onion','Ingwer':'ginger','Petersilie':'parsley','Dill':'dill','Basilikum':'basil','Teig':'dough','Boden':'base'}
def fix(s):
  for a,b in FIX: s=re.sub(a,b,s) if a in (r'\bTL\b',r'\bEL\b') else re.sub(a,b,s,flags=re.I)
  return s
MAN={'Schnitzel durch verquirltes Ei ziehen, in Haferflocken wenden und im Öl je Seite 4–5 Minuten goldbraun braten.':'Dip the schnitzel in the whisked egg, coat with oats and fry in the oil for 4–5 min per side until golden brown.',
'Putenhack salzen, pfeffern und zu 2 Patties formen, im Öl je Seite 5 Minuten braten.':'Season the turkey mince with salt and pepper, shape into 2 patties and fry in the oil for 5 min per side.',
'Gemüse in eine Form geben, Quarkguss darüber, mit Käse bestreuen und 30 Minuten backen.':'Put the vegetables in a baking dish, pour the quark topping over them, sprinkle with cheese and bake for 30 min.',
'Haferflocken mahlen, mit geschmolzener Butter mischen und als Boden in eine Springform (26 cm) drücken.':'Grind the oats, mix with melted butter and press into a springform tin (26 cm) as a base.',
'Spinat in einer Pfanne zusammenfallen lassen (TK-Spinat auftauen) und gut ausdrücken, damit der Boden nicht durchweicht. Mozzarella klein zupfen, Feta zerbröseln.':'Wilt the spinach in a pan (thaw frozen spinach) and squeeze it out well so the base doesn\'t go soggy. Tear the mozzarella into small pieces and crumble the feta.',
'Hafer als Boden in ein Glas geben.':'Put the oats in a glass as the base.',
'Die Beläge gleichmäßig darauf verteilen und bei 200–220 °C backen, bis der Boden knusprig und der Käse geschmolzen ist.':'Spread the toppings evenly on top and bake at 200–220 °C until the base is crispy and the cheese has melted.',
'Brot mit Quark bestreichen.':'Spread the bread with quark.',
'Laugenstange längs aufschneiden.':'Cut the pretzel stick open lengthways.'}
res={};bad=[]
for de,en in zip(inp,out):
  e=fix(en)
  if 'Quark' in de and 'Hüttenkäse' not in de: e=re.sub(r'cottage cheese','quark',e)
  if 'Schnitzel' in de: e=re.sub(r'\bescalopes\b','schnitzels',e);e=re.sub(r'\bescalope\b','schnitzel',e)
  e=e[0].upper()+e[1:] if e else e
  e=re.sub(r'\bSkyr\b','skyr',e);e=re.sub(r'(\d)-(\d)',r'\1–\2',e)
  e=MAN.get(de,e)
  res[de]=e
  miss=[g for g,w in G.items() if re.search(r'(?<![a-zäöüß])'+g.lower(),de.lower()) and w not in e.lower()]
  if miss: bad.append((de,e,miss))
json.dump(res,open('rz-sent.json','w'),ensure_ascii=False)
json.dump(bad,open('satz-bad.json','w'),ensure_ascii=False,indent=0)
print(len(res),'auffällig',len(bad))
