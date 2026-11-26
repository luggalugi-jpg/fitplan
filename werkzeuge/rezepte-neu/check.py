import json,subprocess,statistics
exec(open('naehr.py').read())
o=json.loads(subprocess.check_output(['node','-e',"const s=require('fs').readFileSync('/home/claude/fitplan/rezepte.js','utf8');const o=new Function(s+';return {RDB_N,RDB}')();process.stdout.write(JSON.stringify(o))"]))
def calc(ing,z):
    t=[0]*5;g=0
    for i,a,u in ing:
        gr=a*STK.get(i,100) if u==2 else a
        g+=gr
        for k in range(5):t[k]+=N[i][k]*gr/100
    return [x/z for x in t],g/z
err=[]
for r in o['RDB']:
    v,g=calc(r[12],r[3])
    if r[5]>50: err.append((abs(v[0]-r[5])/r[5],r[1],round(v[0]),r[5],round(v[1]),r[6]))
err.sort(reverse=True)
print('median rel err',statistics.median(e[0] for e in err))
print('>20%:',sum(e[0]>0.2 for e in err),'of',len(err))
for e in err[:15]:print(e)
