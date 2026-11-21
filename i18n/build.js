const fs=require('fs');
const dec=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ');
const out={};
function addSet(keysFile,prefix){
 const keys=require('./'+keysFile);
 for(const f of fs.readdirSync('.').filter(f=>f.startsWith(prefix)&&f.endsWith('.tsv')).sort()){
  for(const line of fs.readFileSync(f,'utf8').split('\n')){if(!line.trim())continue;const t=line.indexOf('\t');const i=+line.slice(0,t),v=line.slice(t+1);
   if(!(i in keys)){console.error('bad index',f,i);continue}
   const k=dec(keys[i]).replace(/\s+/g,' ').trim();if(!k||k===v)continue;out[k]=dec(v).trim();}}
}
addSet('ui-keys.json','t');
addSet('zut-keys.json','zt');
for(const f of ['anleitung','laufanleitungen','uebungen','trainingssysteme','laufplaene'])addSet('c-keys-'+f+'.json','ct-'+f);
for(const f of fs.readdirSync('.').filter(f=>f.startsWith('x-')&&f.endsWith('.tsv')).sort()) // manual extras: de \t en
 for(const line of fs.readFileSync(f,'utf8').split('\n')){if(!line.trim())continue;const [k,v]=line.split('\t');out[k.trim()]=v.trim();}
// content dictionaries (json de->en)
for(const f of fs.readdirSync('.').filter(f=>f.startsWith('cd-')&&f.endsWith('.json')).sort()) Object.assign(out,JSON.parse(fs.readFileSync(f,'utf8')));
for(const k of Object.keys(out)){if(/\{(name|anschrift|mail)\}/.test(k)){const m={name:'{90}',anschrift:'{91}',mail:'{92}'};const k2=k.replace(/\{(name|anschrift|mail)\}/g,(a,b)=>m[b]),v2=out[k].replace(/\{(name|anschrift|mail)\}/g,(a,b)=>m[b]);delete out[k];out[k2]=v2;}}
fs.writeFileSync('/home/claude/fitplan/lang-en.js','// GainPilot – englisches Wörterbuch (Deutsch → Englisch). Erzeugt aus /i18n.\nwindow.GP_EN='+JSON.stringify(out)+';\n');
console.log(Object.keys(out).length,'Einträge',fs.statSync('/home/claude/fitplan/lang-en.js').size,'Bytes');
