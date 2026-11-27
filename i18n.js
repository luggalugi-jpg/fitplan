// GainPilot – Sprache. Deutsch ist die Grundsprache im Code; bei Englisch übersetzt diese Datei alles,
// was auf dem Bildschirm erscheint (Text, Platzhalter, Dialoge, Diagramme), anhand der Wörterbücher
// lang-en.js (Oberfläche und Inhalte) und rezepte-en.js (Rezepte). Muss vor allen anderen Skripten laden.
(function(){
 var wahl=null;try{wahl=localStorage.getItem("gp_lang");}catch(e){}
 if(wahl!=="de"&&wahl!=="en")wahl=null;
 var geraet="de";try{var l=(navigator.languages&&navigator.languages[0])||navigator.language||"de";geraet=/^de\b/i.test(l)?"de":"en";}catch(e){}
 var L=wahl||geraet;
 window.GP_LANG=L;window.GP_LANG_WAHL=wahl;window.GP_LANG_GERAET=geraet;
 window.GP_LOC=L=="en"?"en-GB":"de-DE";
 window.tr=function(s){return s;};
 window.sprache=function(w){try{if(w)localStorage.setItem("gp_lang",w);else localStorage.removeItem("gp_lang");}catch(e){}location.reload();};
 try{document.documentElement.lang=L;}catch(e){}
 if(L!=="en")return;
 var v="3.79";
 document.write('<script src="lang-en.js?v='+v+'"><\/script><script src="rezepte-en.js?v='+v+'"><\/script><script>GP_I18N_START()<\/script>');

 window.GP_I18N_START=function(){
  var D=new Map(),TPL=[],FERTIG=new Set();
  function lade(o){if(!o)return;for(var k in o){var e=o[k];if(e==null||e==="")continue;
   if(k.indexOf("{")>=0&&/\{\d+\}/.test(k)){TPL.push(baue(k,e));}else D.set(k,e);FERTIG.add(typeof e=="string"?e.trim():e);}}
  function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");}
  function baue(k,e){var ord=[];var re=esc(k).replace(/\\\{(\d+)\\\}/g,function(m,n){ord.push(+n);return "([\\s\\S]*?)";});
   return {re:new RegExp("^"+re+"$"),ord:ord,en:e,fix:(k.replace(/\{\d+\}/g,"").match(/[A-Za-zÄÖÜäöüß]/g)||[]).length};}
  lade(window.GP_EN);lade(window.GP_EN_REZ);
  TPL.sort(function(a,b){return b.fix-a.fix;});
  var CACHE=new Map();
  var FRAG=[];D.forEach(function(v,k){if(k.length>=9&&/[A-Za-zÄÖÜäöüß]{3,}.* |^[^ ]*[äöüßÄÖÜ]/.test(k)&&k.length<200&&!(window.GP_EN_REZ||{})[k])FRAG.push(k);});FRAG.sort(function(a,b){return b.length-a.length;});
  var MONATE="January|February|March|April|May|June|July|August|September|October|November|December";var MRE=new RegExp("\\b(\\d{1,2})\\. ("+MONATE+")\\b","g");
  function zahl(s){return s.replace(/(\d),(\d{1,2})(?!\d)/g,"$1.$2").replace(MRE,"$1 $2");}
  var BUCHST=/[A-Za-zÄÖÜäöüß]/;
  function wortzahl(c){var m=c.match(/[A-Za-zÄÖÜäöüß]{2,}/g);return m?m.length:0;}
  function buchst(x){return (x.match(/[A-Za-zÄÖÜäöüß]/g)||[]).length;}
  function fangOk(c,fix){var t=c.trim();if(t&&!BUCHST.test(t.replace(/\b(kg|g|km|m|min|s|h|ml|l|kcal|XP|RPE|RIR|BW|x)\b/g,"")))return true;if(!t||!BUCHST.test(t)||/^[\d\s.,:%+\-–×/()]*[A-Za-z]{0,4}\.?$/.test(t))return true;if(D.has(t)||D.has(t.replace(/^[^A-Za-zÄÖÜäöüß]+|[^A-Za-zÄÖÜäöüß]+$/g,"")))return true;
   var w=wortzahl(t);if(w<=1&&!/[äöüßÄÖÜ]/.test(t)&&t.length<=14)return fix>=8;return fix>=25||(fix>=14&&w<=3);}
  function punkte(k,tief,streng){var tl=k.split(" · "),ch=0,alle=true;var o=tl.map(function(p){var x=p.trim()?kern(p.trim(),tief):"";if(x!=null){ch++;return p.replace(p.trim(),x);}alle=false;return p;});return (streng?alle:ch)?o.join(" · "):null;}
  function doppel(t,tief){var ch=0;var o=t.split(" · ").map(function(p){var q=p.split(": ").map(function(x){var y=x.trim()?kern(x.trim(),tief):null;if(y!=null){ch++;return x.replace(x.trim(),y);}return x;});return q.join(": ");});return ch?o.join(" · "):null;}
  function kern(k,tief){
   var r=D.get(k);if(r!==undefined)return r;
   var ck=(tief?"1":"0")+k;if(CACHE.has(ck))return CACHE.get(ck);
   CACHE.set(ck,null);r=null;
   if(k.indexOf(" · ")>0)r=punkte(k,tief,true);
   if(r==null&&(!tief||tief<3)){
    for(var i=0;i<TPL.length;i++){var t=TPL[i],m=t.re.exec(k);if(m){var ok=true,e=t.en;
      for(var j=0;j<t.ord.length;j++){if(!fangOk(m[j+1],t.fix)){ok=false;break;}}
      if(!ok)continue;
      for(j=0;j<t.ord.length;j++){var wert=m[j+1],w2=wert.trim()?kern(wert.trim(),(tief||0)+1):null;e=e.split("{"+t.ord[j]+"}").join(w2!=null?wert.replace(wert.trim(),w2):wert);}
      r=e;break;}}}
   if(r==null){ // Rand: Emoji, Satzzeichen, Zahlen
    var m2=/^([^A-Za-zÄÖÜäöüß]*)([\s\S]*?)([^A-Za-zÄÖÜäöüß]*)$/.exec(k);
    if(m2&&(m2[1]||m2[3])&&m2[2]&&m2[2]!==k){var x2=kern(m2[2],tief);if(x2!=null)r=m2[1]+x2+m2[3];}}
   if(r==null&&k.indexOf(" · ")>0)r=punkte(k,tief,false);
   if(r==null&&/, /.test(k)&&k.length<120){var tl2=k.split(", "),ok2=true;var o2=tl2.map(function(p){var x=kern(p.trim(),tief);if(x==null)ok2=false;return x;});if(ok2)r=o2.join(", ");}
   if(r==null&&k.indexOf("\n")>=0){var zl=k.split("\n"),zc=0;var zo=zl.map(function(z){var t=z.trim();if(!t)return z;var x=kern(t,tief);if(x==null&&t.indexOf(": ")>0)x=doppel(t,tief);if(x!=null){zc++;return z.replace(t,x);}return z;});if(zc)r=zo.join("\n");}
   if(r==null&&k.indexOf(": ")>0&&k.length<300)r=doppel(k,tief);
   if(r==null&&k.length>1){ // Sätze einzeln
    var teile=k.split(/(?<=[.!?])\s+|\n/);if(teile.length>1){var ok=0,out=teile.map(function(p){var x=kern(p.trim(),tief);if(x!=null){ok++;return x;}return p;});if(ok)r=out.join(" ");}}
   if(r==null&&!tief&&k.length>=12){ // zusammengesetzte Texte: bekannte längere Stücke ersetzen
    var neu=k,n=0;for(var f=0;f<FRAG.length;f++){var fk=FRAG[f];if(neu.indexOf(fk)>=0){neu=neu.split(fk).join(D.get(fk));n++;}}
    if(n)r=neu;}
   CACHE.set(ck,r);if(CACHE.size>30000)CACHE.clear();return r;}
  function tr(s){if(s==null)return s;s=String(s);var k=s.trim();if(!k||(FERTIG.has(k)&&!D.has(k))||!/[A-Za-zÄÖÜäöüß]/.test(k))return zahl(s);
   var r=kern(k);if(r==null)return zahl(s);return zahl(s.replace(k,function(){return r;}));}
  window.tr=tr;window.GP_DICT=D;
  var SKIP={id:1,g:1,ziel:1,ic:1,i:1,tab:1,mtab:1,typ:1};
  window.trDaten=function(o){ // Anleitungstexte (mit HTML) direkt in den Daten übersetzen
   if(Array.isArray(o)){for(var i=0;i<o.length;i++){if(typeof o[i]=="string"){var x=D.get(o[i].replace(/\s+/g," ").trim());if(x!=null)o[i]=x;}else if(o[i]&&typeof o[i]=="object")trDaten(o[i]);}return o;}
   if(o&&typeof o=="object")for(var k in o){if(SKIP[k])continue;var v=o[k];if(typeof v=="string"){var y=D.get(v.replace(/\s+/g," ").trim());if(y!=null)o[k]=y;}else if(v&&typeof v=="object")trDaten(v);}
   return o;};
  var ATTR=["placeholder","title","aria-label","alt"];
  function knoten(n){
   if(n.nodeType===3){var p=n.parentNode;if(!p||p.nodeName==="SCRIPT"||p.nodeName==="STYLE"||p.nodeName==="TEXTAREA")return;
    if(p.closest&&p.closest(".notr,[contenteditable]"))return;
    var v=n.nodeValue,t=tr(v);if(t!==v)n.nodeValue=t;return;}
   if(n.nodeType!==1||n.nodeName==="SCRIPT"||n.nodeName==="STYLE")return;
   if(n.classList&&n.classList.contains("notr"))return;
   attr(n);
   var w=document.createTreeWalker(n,5,{acceptNode:function(x){if(x.nodeType===1){var nm=x.nodeName;if(nm==="SCRIPT"||nm==="STYLE"||nm==="TEXTAREA"||(x.classList&&x.classList.contains("notr"))||x.isContentEditable)return 2;}return 1;}}),c;
   while((c=w.nextNode())){if(c.nodeType===3){var v=c.nodeValue,t=tr(v);if(t!==v)c.nodeValue=t;}else attr(c);}}
  function attr(e){if(!e.getAttribute)return;for(var i=0;i<ATTR.length;i++){var a=e.getAttribute(ATTR[i]);if(a){var t=tr(a);if(t!==a)e.setAttribute(ATTR[i],t);}}
   if(e.nodeName==="INPUT"&&(e.type==="button"||e.type==="submit")&&e.value){var t2=tr(e.value);if(t2!==e.value)e.value=t2;}}
  var mo=new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var m=ms[i];
   if(m.type==="childList"){for(var j=0;j<m.addedNodes.length;j++)knoten(m.addedNodes[j]);}
   else if(m.type==="characterData")knoten(m.target);else if(m.type==="attributes")attr(m.target);}});
  function start(){knoten(document.body);mo.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:ATTR});
   if(document.title)document.title=tr(document.title);}
  if(document.body)start();else document.addEventListener("DOMContentLoaded",start);
  ["alert","confirm"].forEach(function(f){var o=window[f];window[f]=function(m){return o.call(window,tr(m));};});
  var op=window.prompt;window.prompt=function(m,d){return op.call(window,tr(m),d);};
  try{var C=CanvasRenderingContext2D.prototype;["fillText","strokeText"].forEach(function(f){var o=C[f];C[f]=function(t,x,y,mw){return mw===undefined?o.call(this,tr(t),x,y):o.call(this,tr(t),x,y,mw);};});
   var mt=C.measureText;C.measureText=function(t){return mt.call(this,tr(t));};}catch(e){}
 };
})();
