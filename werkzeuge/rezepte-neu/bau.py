import json,os
D=os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(D,'naehr.py')).read())
neu=json.load(open(os.path.join(D,'neu.json')))
rows=[];en={};warn=[]
for k,r in enumerate(neu):
    t=[0]*5;g=0
    for i,a,u in r['ing']:
        gr=a*STK.get(i,100) if u==2 else a
        assert not (u==2 and i not in STK), (r['de'],i)
        g+=gr
        for j in range(5):t[j]+=N[i][j]*gr/100
    z=r['z'];t=[x/z for x in t];g/=z
    kc=round(t[0])
    if kc<80 or kc>1000: warn.append((r['de'],kc))
    nr=3001+k
    steps="\n".join(a for a,b in r['steps'])
    rows.append([nr,r['de'],r['cat'],z,r['t'],kc,round(t[1],1),round(t[2],1),round(t[3],1),round(t[4],1),round(g),"",[[i,a,u] for i,a,u in r['ing']],steps,["Salz & Pfeffer nach Geschmack"] if r['salz'] else []])
    en[r['de']]=r['en']
    for a,b in r['steps']: en[a]=b
json.dump(rows,open(os.path.join(D,'rows.json'),'w'),ensure_ascii=False)
json.dump(en,open('/home/claude/i18n/rz-neu.json','w'),ensure_ascii=False,indent=0)
print(len(rows),len(en));print('warn',warn)
import statistics
for c in sorted(set(r[2] for r in rows)):
    ks=[r[5] for r in rows if r[2]==c];ps=[r[6] for r in rows if r[2]==c]
    print(c,'kcal',min(ks),statistics.median(ks),max(ks),'prot med',statistics.median(ps))
