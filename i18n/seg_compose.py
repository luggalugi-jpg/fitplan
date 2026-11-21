import json,re
W={ # Bausteine (Geschmack/Zutat)
'Tomate':'tomato','Basilikum':'basil','Pilzrahm':'creamy mushroom','Pesto':'pesto','Zucchini':'courgette','Thunfisch':'tuna','Lachs':'salmon','Spinat':'spinach',
'Garnelen':'prawn','Knoblauch':'garlic','Hähnchen':'chicken','Curry':'curry','Ricotta':'ricotta','Vier':'four','Käse':'cheese','Linsen':'lentil','Wurst':'sausage',
'Brokkoli':'broccoli','Zitronen':'lemon','Zitrone':'lemon','Kräuter':'herb','Erdnuss':'peanut','Tofu':'tofu','Miso':'miso','Pilz':'mushroom','Rind':'beef','Puten':'turkey','Pute':'turkey',
'Paprika':'pepper','Meeresfrüchte':'seafood','Gorgonzola':'Gorgonzola','Birne':'pear','Kürbis':'pumpkin','Salbei':'sage','Spargel':'asparagus','Mascarpone':'mascarpone',
'Schinken':'ham','Erbsen':'pea','Oliven':'olive','Olive':'olive','Feta':'feta','Champignon':'mushroom','Zwiebel':'onion','Ziegenkäse':'goat\'s cheese','Beeren':'berry','Mandel':'almond',
'Nutella':'Nutella','Banane':'banana','Apfel':'apple','Zimt':'cinnamon','Mango':'mango','Kokos':'coconut','Kirsch':'cherry','Kirsche':'cherry','Schoko':'chocolate','Erdbeer':'strawberry','Erdbeere':'strawberry','Vanille':'vanilla',
'Pfirsich':'peach','Honig':'honey','Himbeer':'raspberry','Walnuss':'walnut','Ananas':'pineapple','Orange':'orange','Zartbitter':'dark chocolate','Radieschen':'radish','Mozzarella':'mozzarella','Räucherlachs':'smoked salmon',
'Gurke':'cucumber','Hüttenkäse':'cottage cheese','Chia':'chia','Kakao':'cocoa','Hummus':'hummus','Petersilie':'parsley','Kürbiskern':'pumpkin seed','Putenstreifen':'turkey strips','Curry-Ingwer':'curry-ginger',
'Chili':'chilli','Limette':'lime','Sesam':'sesame','Soja':'soy','Ingwer':'ginger','Ei':'egg','Avocado':'avocado','Heidelbeer':'blueberry','Dattel':'date','Kiwi':'kiwi','Bacon':'bacon','Kartoffel':'potato',
'Mais':'sweetcorn','Salsa':'salsa','Räuchertofu':'smoked tofu','Lachsfilet':'salmon fillet','Dill':'dill','Salz':'salt','Karamell':'caramel','BBQ':'BBQ','Rauchpaprika':'smoked paprika','Marmelade':'jam',
'Rote':'red','Bete':'beet','Protein':'protein','Pistazien':'pistachio','Style':'style','Gemüse':'vegetable','Bohnen':'bean','Thai':'Thai','Teriyaki':'teriyaki','Reis':'rice','Couscous':'couscous',
'Quinoa':'quinoa','Bulgur':'bulgur','Süßkartoffel':'sweet potato','Senf':'mustard','Reisnudeln':'rice noodles','Vollkornpasta':'wholemeal pasta','Nudeln':'pasta','Wrap':'wrap','Pfanne':'pan',
'Arrabbiata':'arrabbiata','Salami':'salami','Basilikum-Bowl':'basil bowl',
}
SUFFIX={'Bolognese':'bolognese','Carbonara':'carbonara','Arrabbiata':'arrabbiata','Salami':'salami','Puttanesca':'puttanesca','Ratatouille':'ratatouille','Linsen-Bolognese':'with lentil bolognese'}
SPECIAL={'Margherita':'margherita','Hawaii':'Hawaiian','Mediterranes Gemüse':'Mediterranean vegetable','Chicken-BBQ':'BBQ chicken','Vier-Käse':'four-cheese','Mediterran':'Mediterranean','Mediterran-Olive':'Mediterranean olive','Pilzrahm':'creamy mushroom','Meeresfrüchte':'seafood','Beerenmix':'mixed berry'}
FAM={ # Grundlage: (Englisch, Form)  pre = "<Geschmack> <Grundlage>", with = "<Grundlage> with <A> and <B>"
'Spaghetti':('spaghetti','with'),'Penne':('penne','with'),'Vollkornnudeln':('wholemeal pasta','with'),'Rigatoni':('rigatoni','with'),'Linsennudeln':('lentil pasta','with'),'Reisnudeln':('rice noodles','with'),
'Gnocchi':('gnocchi','with'),'Tortellini':('tortellini','with'),'Ravioli':('ravioli','with'),'Pizza':('pizza','pre_and'),'Flammkuchen':('tarte flambée','pre_and'),'Blätterteig-Pizza':('puff pastry pizza','pre_and'),
'Pizza-Toast':('pizza toast','pre_and'),'Baguette-Pizza':('baguette pizza','pre_and'),'Tortilla-Pizza':('tortilla pizza','pre_and'),'Magerquark-Creme':('low-fat quark cream','pre'),'Skyr-Dessertglas':('skyr dessert glass','pre'),
'Chia-Pudding':('chia pudding','pre'),'Milchreis-Dessert':('rice pudding dessert','pre'),'Protein-Mugcake':('protein mug cake','pre'),'Protein-Frozen-Joghurt':('protein frozen yoghurt','pre'),
'Kleine Protein-Muffins':('mini protein muffins','pre'),'Warmer Ofenfrucht-Becher':('warm baked fruit cup','pre'),'Vollkornpasta':('wholemeal pasta','with'),
'Knusprige Reiswaffeln':('crispy rice cakes','with'),'Hüttenkäse-Snackbecher':('cottage cheese snack pot','with'),'Hummus-Gemüseteller':('hummus and veggie plate','with'),
'Geröstete Kichererbsen':('roasted chickpeas','spice'),'Protein-Joghurt':('protein yoghurt','pre'),'Mini-Vollkornstulle':('mini wholemeal sandwich','with'),'Luftiges Gewürz-Popcorn':('airy spiced popcorn','spice'),
'Putenbrust':('turkey breast','with'),'Putenhack':('turkey mince','with'),'Putenaufschnitt':('sliced turkey','with'),
}
PL={'herb':'herbs','berry':'berries','prawn':'prawns','pea':'peas','olive':'olives','bean':'beans','mushroom':'mushrooms','radish':'radishes','walnut':'walnuts','almond':'almonds','pepper':'peppers','tomato':'tomatoes'}
SPW={'Paprika-Reis':'pepper rice','Curry-Couscous':'curry couscous','Pesto-Vollkornpasta':'pesto wholemeal pasta','Zitronen-Quinoa':'lemon quinoa','Süßkartoffel-Spinat':'sweet potato and spinach','Tomaten-Bulgur':'tomato bulgur','Brokkoli-Kartoffeln':'broccoli and potatoes','Teriyaki-Reisnudeln':'teriyaki rice noodles','Senf-Kartoffel-Pfanne':'mustard potato pan','Mango-Salsa-Wrap':'mango salsa wrap','Spinat-Ricotta-Nudeln':'spinach and ricotta pasta','Bohnen-Tomaten-Pfanne':'bean and tomato pan',
'Hähnchen-Curry':'chicken curry','Pesto-Hähnchen':'pesto chicken','Zitronen-Kräuter-Hähnchen':'lemon-herb chicken','Erdnuss-Tofu':'peanut tofu','Miso-Pilz':'miso mushrooms','Rind-Pilz':'beef and mushrooms','Puten-Paprika':'turkey and peppers','Garnelen-Knoblauch':'garlic prawns',
'Pilzrahm':'creamy mushroom sauce','Vier-Käse':'four-cheese sauce','Meeresfrüchte':'seafood','Mediterran':'Mediterranean vegetables'}
def teil(t,form):
  if form=='spice':
    r=teil(t,'pre');return r and r.replace('pepper','paprika')
  if form=='with' and t in SPW: return SPW[t]
  if t in SPECIAL: return SPECIAL[t]
  if t in W: return W[t]
  ps=t.split('-')
  if all(p in W for p in ps):
    en=[W[p] for p in ps]
    if form=='with': en=[PL.get(x,x) for x in en]
    if form in('with','pre_and'): return ' and '.join(en) if len(en)<=2 else ', '.join(en[:-1])+' and '+en[-1]
    return '-'.join(en)
  return None
def compose(seg):
  for base in sorted(FAM,key=len,reverse=True):
    if seg.startswith(base+' '):
      rest=seg[len(base)+1:];en,form=FAM[base]
      if rest in SUFFIX: return en+' '+SUFFIX[rest]
      x=teil(rest,form)
      if x is None: return None
      return (en+' with '+x) if form=='with' else (x+' '+en)
  return None
if __name__=='__main__':
  a=json.load(open('seg-keys.json'));ok=0;miss=[]
  for s in a:
    c=compose(s)
    if c: ok+=1
  print(ok)
  for s in a[800:]:
    c=compose(s)
    if c: print(s,'=>',c)
