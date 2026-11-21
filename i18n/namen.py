import json,re,sys,glob
sys.path.insert(0,'.')
import seg_compose as C
a=json.load(open('seg-keys.json'))
T={}
for f in sorted(glob.glob('sg*.tsv')):
  for l in open(f):
    if l.strip(): i,v=l.rstrip('\n').split('\t',1);T[int(i)]=v
segen={x:(T.get(i) or C.compose(x)) for i,x in enumerate(a)}
CON={' mit ':' with ',' und ':' and ',', ':', ',' auf ':' on ',' im ':' in the ',' in ':' in ',' an ':' with ',' dazu ':' with ',' nach ':' ',' aus ':' from '}
SEP=r'( mit | und |, | auf | im | in | an | dazu | nach | aus )'
names=json.load(open('rez-names.json'));out={}
for n in names:
  parts=re.split(SEP,n);segs=[]
  for k,p in enumerate(parts):
    if re.fullmatch(SEP,p): segs.append(CON[p]);continue
    e=segen[p]
    if k+1<len(parts) and parts[k+1] in(' mit ',' an ',' dazu ') and ' with ' in e:
      m=re.fullmatch(r'(.+?) with (.+)',e)
      if m: e=m.group(2)+' '+m.group(1)
    segs.append(e)
  r=''.join(segs);r=r[0].upper()+r[1:]
  out[n]=r
json.dump(out,open('rz-names.json','w'),ensure_ascii=False)
if len(sys.argv)>1:
  import random;random.seed(int(sys.argv[1]))
  for n in random.sample(names,40): print(n,'=>',out[n])
  print(sum(1 for v in out.values() if v.count(' with ')>1))
