const acorn=require('/opt/node-tools/node_modules/acorn'),walk=require('/opt/node-tools/node_modules/acorn-walk'),fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
let js=process.argv[3]==='js'?html:html.match(/<script>([\s\S]*)<\/script>/g).map(s=>s.replace(/^<script>|<\/script>$/g,'')).sort((a,b)=>b.length-a.length)[0];
const ast=acorn.parse(js,{ecmaVersion:'latest',sourceType:'script',allowReturnOutsideFunction:true});
const LOWDE=new Set(JSON.parse(fs.existsSync("lowde.json")?fs.readFileSync("lowde.json","utf8"):"[]"));
const out=new Map();
const de=s=>/[A-Za-zÄÖÜäöüß]{2,}/.test(s)&&!/^[\w-]+$/.test(s.trim())||/[äöüßÄÖÜ]/.test(s)||/^[A-ZÄÖÜ][a-zäöüß]{2,}$/.test(s.trim());
const codey=s=>/^(https?:|\.\/|#[\w-]+$|[\w-]+\.(js|png|jpg|mp4|html|json)$)/.test(s)||/^[a-z][\w-]*$/.test(s.trim())&&!LOWDE.has(s.trim())||/[{};]\s*$/.test(s.trim())&&/:/.test(s)||/^(select|insert|update|create|rpc)\b/i.test(s);
function add(t,ctx){t=t.replace(/\s+/g,' ').trim();if(!t||t.length<2)return;if(/^[\d\s.,:%+\-–×·/{}()#]*$/.test(t.replace(/\{\d+\}/g,'')))return;if(!de(t)||codey(t))return;out.set(t,(out.get(t)||0)+1)}
function runs(s){ // s may contain html; extract text runs and attr values
  if(!/[<>]/.test(s)){add(s);return}
  s.replace(/\b(?:placeholder|title|aria-label|alt|data-tip)="([^"]*)"/g,(m,v)=>{add(v)});
  s.replace(/<style[\s\S]*?<\/style>/g,'').replace(/<[^>]*>/g,'\u0001').split('\u0001').forEach(x=>add(x));
}
walk.full(ast,n=>{
 if(n.type==='Literal'&&typeof n.value==='string')runs(n.value);
 if(n.type==='TemplateLiteral'){let s='';n.quasis.forEach((q,i)=>{s+=q.value.cooked??q.value.raw;if(i<n.expressions.length)s+='{'+i+'}'});runs(s)}
});
// html outside scripts
if(process.argv[3]!=='js'){const body=html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'');runs(body)}
const arr=[...out.entries()].sort((a,b)=>a[0].localeCompare(b[0],'de'));
fs.writeFileSync(process.argv[4],JSON.stringify(arr.map(a=>a[0]),null,0));
console.log(arr.length,arr.reduce((a,b)=>a+b[0].length,0));
