/* Übungs-Animationen: gezeichnete Strichfigur (SVG), die zwischen Start- und Endposition pendelt.
   Seitenansicht: Figur schaut nach rechts. Arme/Beine werden per Zwei-Gelenk-IK zu Zielpunkten gerechnet.
   Vorderansicht (fv:1): symmetrische Figur, z. B. für Seitheben. */
(function(){
const L={t:38,nk:5,hd:8,ua:21,fa:19,th:29,sh:28,ft:9,wr:6};
const R=Math.PI/180,dir=a=>[Math.cos(a*R),Math.sin(a*R)],add=(p,v,k)=>[p[0]+v[0]*(k||1),p[1]+v[1]*(k||1)];
function ik(A,T,l1,l2,s){let dx=T[0]-A[0],dy=T[1]-A[1],D=Math.hypot(dx,dy);
 D=Math.max(Math.abs(l1-l2)+.01,Math.min(l1+l2-.01,D));const b=Math.atan2(dy,dx);
 const a=Math.acos((l1*l1+D*D-l2*l2)/(2*l1*D));const ang=b+(s||1)*a;
 return [[A[0]+l1*Math.cos(ang),A[1]+l1*Math.sin(ang)],[A[0]+D*Math.cos(b),A[1]+D*Math.sin(b)]];}
function loc(p,frA,frB,o){const dx=frB[0]-frA[0],dy=frB[1]-frA[1],n=Math.hypot(dx,dy)||1,u=[dx/n,dy/n],v=[-u[1],u[0]];
 return [p[0]+u[0]*o[0]+v[0]*o[1],p[1]+u[1]*o[0]+v[1]*o[1]];}
// Gelenke einer Seitenansicht-Pose
function side(P){const J={};J.h=P.h;const td=dir(P.t);J.s=add(P.h,td,L.t);
 J.hd=add(J.s,dir(P.t+(P.n||0)),L.nk+L.hd);
 const tgt=(abs,rel,hrel)=>abs?abs:(rel?loc(J.s,J.h,J.s,rel):(hrel?add(J.h,hrel):null));
 const a1=tgt(P.a,P.ar,P.ah),a2=tgt(P.a2,P.ar2,P.ah2)||a1;
 [[J,"e","a",a1,P.eb],[J,"e2","a2",P.a2||P.ar2||P.ah2?a2:a1,P.eb2!=null?P.eb2:P.eb]].forEach(([J,e,a,T,s])=>{const r=ik(J.s,T,L.ua,L.fa,s==null?1:s);J[e]=r[0];J[a]=r[1];});
 const f1=P.f||add(P.h,P.fr),f2=P.f2||(P.fr2?add(P.h,P.fr2):f1);
 let r=ik(J.h,f1,L.th,L.sh,P.kb==null?-1:P.kb);J.k=r[0];J.f=r[1];
 r=ik(J.h,f2,L.th,L.sh,P.kb2!=null?P.kb2:(P.kb==null?-1:P.kb));J.k2=r[0];J.f2=r[1];
 J.t=add(J.f,dir(P.ft||0),L.ft);J.he=add(J.f,dir((P.ft||0)+180),3);
 const ft2=P.ft2!=null?P.ft2:(P.ft||0);J.t2=add(J.f2,dir(ft2),L.ft);J.he2=add(J.f2,dir(ft2+180),3);
 if(P.wr!=null){J.w=add(J.a,dir(P.wr),L.wr);J.w2=add(J.a2,dir(P.wr),L.wr);}
 return J;}
// Gelenke einer Vorderansicht-Pose (cx = Mitte, hy = Becken-Höhe)
function front(P){const J={},c=P.c||100,hy=P.hy,tl=P.tilt||0;
 const rot=p=>{const dx=p[0]-c,dy=p[1]-hy,a=tl*R;return [c+dx*Math.cos(a)-dy*Math.sin(a),hy+dx*Math.sin(a)+dy*Math.cos(a)];};
 J.h=[c,hy];J.n=rot([c,hy-L.t]);J.hd=rot([c,hy-L.t-L.nk-L.hd]);J.s=rot([c+12,hy-L.t+3]);J.s2=rot([c-12,hy-L.t+3]);
 J.hp=[c+7,hy];J.hp2=[c-7,hy];
 const m=p=>[2*c-p[0],p[1]];
 let r=ik(J.s,P.a,L.ua,L.fa,P.eb==null?1:P.eb);J.e=r[0];J.a=r[1];
 r=ik(J.s2,P.a2||m(P.a),L.ua,L.fa,-(P.eb==null?1:P.eb));J.e2=r[0];J.a2=r[1];
 r=ik(J.hp,P.f,L.th,L.sh,P.kb==null?-1:P.kb);J.k=r[0];J.f=r[1];
 r=ik(J.hp2,P.f2||m(P.f),L.th,L.sh,-(P.kb==null?-1:P.kb));J.k2=r[0];J.f2=r[1];
 J.t=add(J.f,[1,0],6);J.t2=add(J.f2,[-1,0],6);return J;}
function lerp(a,b,x){if(typeof a=="number"&&typeof b=="number")return a+(b-a)*x;
 if(Array.isArray(a)&&Array.isArray(b))return a.map((v,i)=>lerp(v,b[i],x));return x<.5?a:b;}
function mix(A,B,x){const o={};new Set(Object.keys(A).concat(Object.keys(B))).forEach(k=>{
 o[k]=(k in A&&k in B)?lerp(A[k],B[k],x):(k in B?B[k]:A[k]);});return o;}
const ln=(p,q,w,c,op)=>`<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${op?` opacity="${op}"`:""}/>`;
const ci=(p,r,f,s,w)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r}" fill="${f}"${s?` stroke="${s}" stroke-width="${w||2}"`:""}/>`;
const FIG="var(--txt)",EQ="var(--mut)",PL="var(--brand)";
function props(list,J,front){return (list||[]).filter(p=>!!p.vorn==front).map(p=>{
 const at=k=>{let q=J[p.at]||[0,0];if(p.o)q=p.fr?loc(q,J[p.fr[0]],J[p.fr[1]],p.o):add(q,p.o);return q;};
 if(p.r)return `<rect x="${p.r[0]}" y="${p.r[1]}" width="${p.r[2]}" height="${p.r[3]}" rx="${p.rx==null?2:p.rx}" fill="${EQ}" opacity="${p.op||.35}"/>`;
 if(p.l)return ln([p.l[0],p.l[1]],[p.l[2],p.l[3]],p.w||3,EQ,p.op||.6);
 if(p.c)return ci([p.c[0],p.c[1]],p.c[2],EQ);
 if(p.plate){const q=at();return ci(q,p.rr||11,PL,null)+ci(q,2.5,"var(--card)");}
 if(p.db){const q=at();return ci(q,p.rr||5,PL,null);}
 if(p.bar){const q=at(),u=dir(p.ang||0);return ln(add(q,u,-(p.len||30)/2),add(q,u,(p.len||30)/2),3.5,EQ,.9);}
 if(p.cable){const q=at();return ln(p.cable,q,1.5,EQ,.9)+ci(p.cable,3.5,EQ);}
 if(p.pad){const q=at();return ci(q,p.rr||5,EQ,null);}
 if(p.sled){const q=at(),u=dir(p.ang||0);return ln(add(q,u,-13),add(q,u,13),5,EQ,.8);}
 return "";}).join("");}
function draw(def,P){const fv=def.fv,J=fv?front(P):side(P);
 let h=`<line x1="4" y1="141" x2="196" y2="141" stroke="var(--line)" stroke-width="2"/>`+props(def.p,J,false);
 const lw=5;
 if(fv){h+=ln(J.hp,J.k,lw,FIG)+ln(J.k,J.f,lw,FIG)+ln(J.f,J.t,4,FIG)+ln(J.hp2,J.k2,lw,FIG)+ln(J.k2,J.f2,lw,FIG)+ln(J.f2,J.t2,4,FIG);
  h+=ln(J.hp,J.hp2,lw,FIG)+ln(J.h,J.n,6,FIG)+ln(J.s,J.s2,lw,FIG)+ci(J.hd,L.hd,FIG);
  h+=ln(J.s,J.e,lw,FIG)+ln(J.e,J.a,lw,FIG)+ln(J.s2,J.e2,lw,FIG)+ln(J.e2,J.a2,lw,FIG);}
 else{const op=.38;
  h+=ln(J.h,J.k2,lw,FIG,op)+ln(J.k2,J.f2,lw,FIG,op)+ln(J.he2,J.t2,4,FIG,op);
  h+=ln(J.s,J.e2,lw,FIG,op)+ln(J.e2,J.a2,lw,FIG,op)+(J.w2?ln(J.a2,J.w2,4,FIG,op):"");
  h+=ln(J.h,J.k,lw,FIG)+ln(J.k,J.f,lw,FIG)+ln(J.he,J.t,4,FIG);
  h+=ln(J.h,J.s,6.5,FIG)+ci(J.hd,L.hd,FIG);
  h+=ln(J.s,J.e,lw,FIG)+ln(J.e,J.a,lw,FIG)+(J.w?ln(J.a,J.w,4,FIG):"");}
 return h+props(def.p,J,true);}
const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
// Phase 0..1 eines Zyklus: Start halten → zur Endposition → halten → zurück
function phase(def,ms){const mv=def.d||1100,hA=def.hA!=null?def.hA:350,hB=def.hB!=null?def.hB:350,T=hA+mv+hB+mv;
 let t=ms%T;if(t<hA)return 0;t-=hA;if(t<mv)return ease(t/mv);t-=mv;if(t<hB)return 1;t-=hB;return 1-ease(t/mv);}
function frame(def,x){const A=def.k[0],B=Object.assign({},A,def.k[1]);return draw(def,mix(A,B,x));}
let laeuft=null;
window.uebAnimStart=function(el,def,{statisch}={}){uebAnimStop();if(!el||!def)return;
 const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("viewBox","0 0 200 150");
 svg.setAttribute("role","img");svg.style.cssText="width:100%;max-width:340px;display:block;margin:0 auto";
 el.innerHTML="";el.appendChild(svg);
 const ruhig=statisch||(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
 if(ruhig){svg.innerHTML=frame(def,1);return;}
 const t0=performance.now();let last=0;
 const tick=now=>{if(!svg.isConnected){laeuft=null;return;}
  if(now-last>30){svg.innerHTML=frame(def,phase(def,now-t0));last=now;}laeuft=requestAnimationFrame(tick);};
 laeuft=requestAnimationFrame(tick);};
window.uebAnimStop=function(){if(laeuft)cancelAnimationFrame(laeuft);laeuft=null;};
window.uebAnimFrame=frame;
})();
/* Bewegungen je Übung: k[0] = Startposition, k[1] = Änderungen für die Endposition, p = Geräte */
const ST={h:[100,80],t:-90,f:[100,137],ft:0};
const UEB_ANIM={
"Kniebeugen":{k:[{h:[98,80],t:-88,f:[102,137],ar:[2,-6],eb:1},{h:[80,110],t:-52}],p:[{plate:1,at:"s",fr:["h","s"],o:[1,-8]}]},
"Bankdrücken":{k:[{h:[122,99],t:180,a:[84,59],eb:-1,f:[150,137]},{a:[90,89]}],p:[{r:[48,104,86,7]},{l:[60,111,60,140]},{l:[124,111,124,140]},{plate:1,at:"a",vorn:1}]},
"Schrägbankdrücken":{k:[{h:[118,101],t:-145,a:[93,41],eb:-1,f:[150,137]},{a:[99,71]}],p:[{l:[124,108,80,77],w:6,op:.45},{r:[100,105,30,6]},{l:[115,111,115,140]},{plate:1,at:"a",vorn:1}]},
"Kurzhantel-Flys":{fv:1,v:"Ansicht von oben",k:[{c:100,hy:98,a:[106,64],eb:1,f:[105,165]},{a:[146,70]}],p:[{r:[88,26,24,114],op:.22},{db:1,at:"a",vorn:1},{db:1,at:"a2",vorn:1}]},
"Liegestütze":{k:[{h:[105,111],t:-158,a:[72,137],eb:1,f:[163,132],ft:115},{h:[110,125],t:-172}]},
"Dips":{k:[{h:[95,73],t:-80,a:[100,77],eb:1,fr:[-14,36],ft:60},{h:[93,88],t:-70}],p:[{l:[68,79,136,79],w:4,vorn:1},{l:[76,79,76,140]},{l:[128,79,128,140]}]},
"Schulterdrücken":{k:[{h:[92,98],t:-90,ar:[2,9],eb:1,f:[126,137]},{ar:[37,3]}],p:[{r:[76,102,36,7]},{l:[94,109,94,140]},{l:[82,102,82,50],w:4,op:.45},{plate:1,at:"a",vorn:1}]},
"Seitheben":{fv:1,v:"Ansicht von vorn",k:[{c:100,hy:80,a:[117,84],eb:1,f:[106,137]},{a:[150,52]}],p:[{db:1,at:"a",vorn:1},{db:1,at:"a2",vorn:1}]},
"Frontheben":{k:[{...ST,ar:[-37,5],eb:1},{ar:[0,38]}],p:[{db:1,at:"a",vorn:1}]},
"Face Pulls":{k:[{h:[95,80],t:-92,f:[100,137],f2:[86,137],a:[136,41],eb:-1},{a:[106,31]}],p:[{l:[172,10,172,140],w:4},{cable:[168,38],at:"a"}]},
"Klimmzüge":{k:[{h:[95,90],t:-87,a:[100,14],eb:-1,fr:[-14,42],ft:60},{h:[95,60]}],p:[{l:[70,14,130,14],w:2,op:.3},{c:[100,14,3.5]}]},
"Latzug":{k:[{h:[94,100],t:-92,a:[104,28],eb:1,f:[124,137]},{t:-102,a:[108,64]}],p:[{r:[78,104,34,7]},{l:[95,111,95,140]},{c:[124,88,5]},{cable:[100,8],at:"a"}]},
"Rudern mit Langhantel":{k:[{h:[82,84],t:-30,a:[112,104],eb:1,f:[100,137]},{a:[100,86]}],p:[{plate:1,at:"a",vorn:1}]},
"Rudern mit Kurzhantel":{k:[{h:[78,80],t:-20,a:[111,105],a2:[116,108],eb:1,eb2:1,f:[92,136],f2:[48,107]},{a:[92,82]}],p:[{r:[40,108,84,7]},{l:[50,115,50,140]},{l:[114,115,114,140]},{db:1,at:"a",vorn:1}]},
"Kreuzheben":{k:[{h:[78,106],t:-28,a:[106,127],eb:1,f:[100,137]},{h:[98,80],t:-92,a:[101,84]}],p:[{plate:1,at:"a",vorn:1}]},
"Rückenstrecken":{k:[{h:[105,80],t:75,ar:[-12,8],eb:1,f:[65,118],ft:60},{t:-43}],p:[{c:[110,85,6]},{l:[110,91,110,140],w:4},{l:[58,114,68,126],w:4},{l:[63,120,63,140],w:4}]},
"Beinpresse":{k:[{h:[75,112],t:-140,a:[74,118],eb:1,f:[110,77],ft:-135},{f:[95,92]}],p:[{l:[86,112,166,32],w:3,op:.4},{l:[80,119,38,84],w:6,op:.45},{r:[46,120,64,20]},{sled:1,at:"f",o:[2,-2],ang:45,vorn:1}]},
"Ausfallschritte":{k:[{h:[98,80],t:-90,f:[100,137],f2:[98,137],ar:[-37,2],eb:1},{h:[98,108],t:-88,f:[128,137],f2:[70,132],ft2:32}],p:[{db:1,at:"a",vorn:1}]},
"Beinbeuger":{k:[{h:[97,99],t:180,a:[44,110],eb:-1,f:[152,99],kb:1,ft:80},{f:[124,72],ft:0}],p:[{r:[36,104,96,7]},{l:[50,111,50,140]},{l:[120,111,120,140]},{pad:1,at:"f",fr:["k","f"],o:[-3,-7],vorn:1}]},
"Beinstrecker":{k:[{h:[90,100],t:-95,a:[96,102],eb:1,f:[117,128],ft:60},{f:[146,97],ft:-30}],p:[{r:[72,104,36,7]},{l:[76,104,72,56],w:5,op:.45},{l:[90,111,90,140]},{pad:1,at:"f",fr:["k","f"],o:[-4,-7],vorn:1}]},
"Wadenheben":{k:[{h:[99,74],t:-90,f:[99,131],ft:-20,ar:[-37,1],eb:1},{h:[101,62],f:[101,119],ft:63}],p:[{r:[104,128,40,13],rx:1}]},
"Hip Thrust":{k:[{h:[102,124],t:-142,f:[132,137],ah:[3,-10],eb:1},{h:[110,99],t:180}],p:[{r:[30,95,46,9]},{l:[40,104,40,140]},{l:[68,104,68,140]},{plate:1,at:"h",o:[0,-10],vorn:1}]},
"Bizepscurls":{k:[{...ST,ar:[-37,3],eb:1},{ar:[-8,13]}],p:[{db:1,at:"a",vorn:1}]},
"Hammercurls":{k:[{...ST,ar:[-37,3],eb:1},{ar:[-8,13]}],p:[{db:1,at:"a",vorn:1}]},
"Trizepsdrücken am Kabel":{k:[{h:[98,80],t:-84,f:[100,137],f2:[92,137],ar:[-14,14],eb:1},{ar:[-36,10]}],p:[{l:[152,8,152,140],w:4},{cable:[147,14],at:"a"}]},
"Trizeps-Kickbacks":{k:[{h:[84,84],t:-18,a:[104,103],a2:[110,104],eb:1,f:[102,137],f2:[96,137]},{a:[82,86]}],p:[{db:1,at:"a",vorn:1}]},
"Unterarmcurls":{k:[{h:[84,101],t:-62,a:[117,101],eb:1,f:[116,137],wr:60},{wr:-35}],p:[{r:[64,104,38,7]},{l:[82,111,82,140]},{db:1,at:"w",vorn:1}]},
"Plank":{hB:1800,k:[{h:[107,134],t:-154,a:[88,138],eb:1,f:[163,132],ft:115},{h:[107,124],t:-168}]},
"Crunches":{k:[{h:[100,133],t:180,ar:[-11,5],eb:1,f:[128,137]},{t:-152}]},
"Beinheben":{k:[{h:[108,133],t:180,a:[146,136],eb:1,f:[164,129],ft:-5},{f:[112,77],ft:-88}]},
"Seitstütz":{hB:1800,v:"Ansicht von vorn",k:[{h:[107,134],t:-154,a:[88,138],eb:1,ah2:[2,-6],eb2:-1,f:[163,132],ft:-60},{h:[107,124],t:-168}]},
"Russian Twist":{fv:1,v:"Ansicht von vorn",k:[{c:100,hy:126,tilt:-10,a:[80,104],a2:[86,104],eb:1,f:[114,136]},{tilt:10,a:[120,104],a2:[114,104]}],p:[{db:1,at:"a",rr:6,vorn:1}]},
"Kabelcrunch":{k:[{h:[100,108],t:-86,ar:[2,8],eb:1,f:[71,137],ft:180},{h:[96,106],t:15,ar:[-2,10]}],p:[{l:[88,4,88,140],w:4},{cable:[94,10],at:"a"}]}
};
window.UEB_ANIM=UEB_ANIM;
/* Anleitungen: s = Schritte, a = Atmung, f = typische Fehler, t = Tipps, l = leichtere Variante */
window.UEB_TXT={
"Kniebeugen":{s:["Stange auf den oberen Rücken legen (nicht auf den Nacken), Hände etwas weiter als schulterbreit.","Füße etwa schulterbreit, Fußspitzen leicht nach außen.","Rumpf anspannen, dann Hüfte nach hinten und unten schieben und gleichzeitig die Knie beugen.","So tief gehen, wie du mit geradem Rücken kommst – Ziel: Oberschenkel mindestens parallel zum Boden.","Über die ganze Fußsohle kraftvoll nach oben drücken, bis du wieder aufrecht stehst."],a:"Oben tief einatmen und Luft halten (Bauch fest), unten wieder hochdrücken, oben ausatmen.",f:["Knie fallen nach innen","Fersen heben vom Boden ab","Rücken rundet sich unten"],t:["Knie zeigen in die gleiche Richtung wie die Fußspitzen.","Blick nach vorn, Brust bleibt offen."],l:"Kniebeugen ohne Gewicht oder mit einer Kurzhantel vor der Brust (Goblet Squat)."},
"Bankdrücken":{s:["Auf die Bank legen, Augen etwa unter der Stange, Füße fest auf dem Boden.","Schulterblätter zusammen und nach unten ziehen, leichtes Hohlkreuz ist okay, Po bleibt auf der Bank.","Stange etwas weiter als schulterbreit greifen und aus der Ablage heben.","Kontrolliert zur unteren Brust absenken, Ellbogen etwa 45–70° vom Körper.","Stange kraftvoll nach oben drücken, bis die Arme fast gestreckt sind."],a:"Beim Absenken einatmen, beim Hochdrücken ausatmen.",f:["Stange prallt von der Brust ab","Ellbogen stehen 90° seitlich ab","Po hebt von der Bank ab"],t:["Bei schweren Gewichten immer mit Sicherungspartner oder Sicherheitsablagen trainieren.","Handgelenke gerade halten, Stange liegt über dem Unterarm."],l:"Kurzhantel-Bankdrücken oder Liegestütze."},
"Schrägbankdrücken":{s:["Bank auf etwa 30–45° stellen und hinlegen, Füße fest am Boden.","Schulterblätter zusammen- und nach unten ziehen.","Gewicht über den Schultern halten.","Langsam zur oberen Brust (unter dem Schlüsselbein) absenken.","Senkrecht nach oben drücken."],a:"Beim Absenken einatmen, beim Drücken ausatmen.",f:["Bank zu steil – dann arbeiten vor allem die Schultern","Schultern rollen nach vorn","Gewicht wird nur halb abgesenkt"],t:["Mit Kurzhanteln ist die Bewegung freier und schonender für die Schultern."],l:"Schrägbankdrücken mit leichten Kurzhanteln."},
"Kurzhantel-Flys":{s:["Auf eine Flachbank legen, Kurzhanteln über der Brust, Handflächen zeigen zueinander.","Ellbogen leicht beugen und diesen Winkel die ganze Zeit halten.","Arme in einem weiten Bogen seitlich öffnen, bis du eine Dehnung in der Brust spürst.","Im gleichen Bogen wieder über der Brust zusammenführen – wie eine Umarmung."],a:"Beim Öffnen einatmen, beim Zusammenführen ausatmen.",f:["Arme durchgestreckt – belastet die Ellbogen","Zu tief absenken","Daraus wird ein Drücken mit stark gebeugten Armen"],t:["Lieber leichter und sauber: Flys sind eine Isolationsübung, keine Kraftübung."],l:"Flys am Kabelzug oder an der Butterfly-Maschine."},
"Liegestütze":{s:["Hände etwas weiter als schulterbreit unter die Schultern setzen.","Körper von Kopf bis Fuß in eine gerade Linie bringen, Bauch und Po fest.","Brust kontrolliert Richtung Boden absenken, Ellbogen zeigen schräg nach hinten.","Kurz vor dem Boden wieder hochdrücken, bis die Arme fast gestreckt sind."],a:"Beim Absenken einatmen, beim Hochdrücken ausatmen.",f:["Hüfte hängt durch","Po ragt nach oben","Kopf hängt nach unten"],t:["Lieber weniger Wiederholungen und dafür ganz runter."],l:"Liegestütze an einer Bank oder auf den Knien."},
"Dips":{s:["Am Barren stützen, Arme gestreckt, Schultern weg von den Ohren.","Beine leicht beugen, Oberkörper etwas nach vorn neigen.","Ellbogen nach hinten beugen und absenken, bis die Oberarme etwa waagerecht sind.","Wieder nach oben drücken, bis die Arme gestreckt sind."],a:"Beim Absenken einatmen, beim Hochdrücken ausatmen.",f:["Zu tief absenken – belastet die Schultern","Schultern ziehen hoch zu den Ohren","Schwung aus den Beinen"],t:["Mehr Vorneigung = mehr Brust, aufrechter = mehr Trizeps.","Bei Schulterschmerzen die Tiefe verringern."],l:"Bankdips (Hände hinter dir auf einer Bank) oder Dips an der Maschine mit Unterstützung."},
"Schulterdrücken":{s:["Aufrecht auf eine Bank mit Lehne setzen, Füße fest am Boden.","Stange etwas weiter als schulterbreit vor der oberen Brust halten, Ellbogen unter den Händen.","Bauch und Po anspannen.","Stange senkrecht über den Kopf drücken, Kopf dabei kurz nach hinten nehmen.","Kontrolliert zurück bis auf Kinnhöhe."],a:"Vor dem Drücken einatmen, beim Drücken ausatmen.",f:["Starkes Hohlkreuz","Stange wird vor dem Körper statt senkrecht gedrückt","Halbe Bewegung"],t:["Oben stehen Hände, Ellbogen und Schultern übereinander."],l:"Schulterdrücken mit Kurzhanteln oder an der Maschine."},
"Seitheben":{s:["Aufrecht stehen, Kurzhanteln seitlich neben dem Körper, Ellbogen leicht gebeugt.","Arme seitlich anheben, bis sie etwa waagerecht sind.","Oben kurz halten, die Ellbogen führen die Bewegung.","Langsam wieder absenken."],a:"Beim Heben ausatmen, beim Absenken einatmen.",f:["Schwung aus dem Oberkörper","Schultern ziehen zu den Ohren","Arme höher als Schulterhöhe"],t:["Leichtes Gewicht reicht – die seitliche Schulter ist ein kleiner Muskel.","Langsam absenken bringt viel."],l:"Seitheben einarmig am Kabelzug oder mit sehr leichten Hanteln."},
"Frontheben":{s:["Aufrecht stehen, Kurzhanteln vor den Oberschenkeln.","Arme mit leicht gebeugten Ellbogen nach vorn anheben.","Bis etwa Schulterhöhe heben.","Langsam wieder absenken."],a:"Beim Heben ausatmen, beim Absenken einatmen.",f:["Mit dem Oberkörper nach hinten lehnen","Schwung holen","Zu hoch heben"],t:["Bauch anspannen, damit der Rücken ruhig bleibt.","Abwechselnd links und rechts geht auch."],l:"Frontheben mit einer Hantelscheibe oder leichten Kurzhanteln."},
"Face Pulls":{s:["Seilgriff am Kabelzug auf Kopfhöhe einstellen.","Seil mit beiden Händen greifen und einen Schritt zurückgehen, Arme gestreckt.","Seil Richtung Gesicht ziehen, Ellbogen gehen hoch und nach außen.","Am Ende die Hände neben den Ohren auseinanderziehen und Schulterblätter zusammendrücken.","Kontrolliert zurück."],a:"Beim Ziehen ausatmen, beim Zurückgehen einatmen.",f:["Mit dem ganzen Körper nach hinten lehnen","Ellbogen sinken nach unten","Zu schweres Gewicht"],t:["Gut für Haltung und gesunde Schultern – eher viele Wiederholungen."],l:"Mit einem Widerstandsband an einer Tür oder Stange."},
"Klimmzüge":{s:["Stange etwas weiter als schulterbreit greifen (Handflächen nach vorn).","Hängen, Arme fast gestreckt, Schultern aktiv nach unten ziehen.","Brust zur Stange ziehen, bis das Kinn über der Stange ist.","Kontrolliert wieder ablassen bis fast in den gestreckten Hang."],a:"Beim Hochziehen ausatmen, beim Ablassen einatmen.",f:["Schwung aus den Beinen (Kippen)","Nur halbe Wiederholungen","Schultern hängen locker in den Ohren"],t:["Kein Klimmzug möglich? Nur langsam ablassen (negative Klimmzüge) trainieren."],l:"Klimmzüge mit Widerstandsband, an der Maschine mit Unterstützung, oder Latzug."},
"Latzug":{s:["Hinsetzen, Oberschenkel unter die Polster klemmen.","Stange etwas weiter als schulterbreit greifen.","Oberkörper leicht nach hinten neigen, Brust raus.","Stange zur oberen Brust ziehen, Ellbogen nach unten und hinten.","Langsam nach oben zurückführen, bis die Arme gestreckt sind."],a:"Beim Ziehen ausatmen, beim Zurückführen einatmen.",f:["Stange in den Nacken ziehen","Stark nach hinten schwingen","Gewicht oben fallen lassen"],t:["Denke daran, die Ellbogen in die Hosentaschen zu ziehen."],l:"Weniger Gewicht oder einarmig am Kabel."},
"Rudern mit Langhantel":{s:["Hüftbreit stehen, Stange schulterbreit greifen.","Knie leicht beugen, Oberkörper mit geradem Rücken nach vorn neigen (etwa 30–45°).","Stange zum unteren Bauch ziehen, Ellbogen nah am Körper.","Oben Schulterblätter zusammendrücken.","Kontrolliert ablassen, bis die Arme gestreckt sind."],a:"Beim Ziehen ausatmen, beim Ablassen einatmen.",f:["Runder Rücken","Oberkörper richtet sich beim Ziehen auf","Schwung aus den Beinen"],t:["Rücken bleibt die ganze Zeit im gleichen Winkel."],l:"Rudern mit Kurzhantel und Abstützen auf der Bank."},
"Rudern mit Kurzhantel":{s:["Ein Knie und die gleiche Hand auf eine Bank stützen, das andere Bein steht am Boden.","Rücken gerade, etwa parallel zum Boden.","Kurzhantel mit gestrecktem Arm hängen lassen.","Hantel Richtung Hüfte ziehen, Ellbogen nah am Körper.","Langsam wieder ablassen. Danach die Seite wechseln."],a:"Beim Ziehen ausatmen, beim Ablassen einatmen.",f:["Oberkörper dreht sich mit auf","Zur Brust statt zur Hüfte ziehen","Runder Rücken"],t:["Stell dir vor, du startest einen Rasenmäher – aber langsam."],l:"Weniger Gewicht oder Rudern am Kabelzug sitzend."},
"Kreuzheben":{s:["Hüftbreit stehen, Stange über der Fußmitte, nah an den Schienbeinen.","Hüfte nach hinten, Knie beugen und Stange schulterbreit greifen.","Rücken gerade, Brust raus, Schultern leicht vor der Stange, Rumpf fest.","Mit den Beinen vom Boden wegdrücken, Stange nah am Körper hochziehen.","Oben aufrecht stehen (nicht nach hinten lehnen), dann mit geradem Rücken kontrolliert absetzen."],a:"Unten einatmen und Luft halten, oben ausatmen.",f:["Runder Rücken","Stange entfernt sich vom Körper","Hüfte schießt zuerst hoch"],t:["Diese Übung braucht Technik: mit wenig Gewicht anfangen.","Bei Rückenbeschwerden vorher ärztlich abklären."],l:"Rumänisches Kreuzheben mit Kurzhanteln oder Kreuzheben mit Kettlebell."},
"Rückenstrecken":{s:["Am Rückenstrecker (römischer Stuhl) einstellen: Polster unter dem Hüftknochen, Füße fest.","Arme vor der Brust kreuzen.","Mit geradem Rücken nach vorn unten beugen.","Wieder hochkommen, bis Oberkörper und Beine eine Linie bilden.","Nicht ins Hohlkreuz überstrecken."],a:"Beim Hochkommen ausatmen, beim Absenken einatmen.",f:["Überstrecken nach oben","Schwung","Polster zu hoch, so dass die Hüfte nicht beugen kann"],t:["Schwerer machen: Hantelscheibe vor die Brust nehmen."],l:"Superman am Boden: Bauchlage, Arme und Beine leicht anheben."},
"Beinpresse":{s:["Hinsetzen, Rücken und Po fest an der Lehne.","Füße hüftbreit mittig auf die Platte stellen.","Sicherung lösen und die Knie kontrolliert Richtung Brust beugen.","So tief gehen, wie der Po auf dem Sitz bleibt.","Über die ganze Fußsohle zurückdrücken, Knie oben nicht ganz durchstrecken."],a:"Beim Beugen einatmen, beim Drücken ausatmen.",f:["Knie oben komplett durchgedrückt","Po hebt sich unten vom Sitz","Knie fallen nach innen"],t:["Füße höher auf der Platte = mehr Po und Beinbeuger."],l:"Weniger Gewicht oder Kniebeugen ohne Gewicht."},
"Ausfallschritte":{s:["Aufrecht stehen, Kurzhanteln seitlich halten.","Einen großen Schritt nach vorn machen.","Beide Knie beugen, bis das hintere Knie knapp über dem Boden ist.","Über die vordere Ferse kraftvoll zurück in den Stand drücken.","Seite wechseln."],a:"Beim Absenken einatmen, beim Hochdrücken ausatmen.",f:["Vorderes Knie knickt nach innen","Schritt zu kurz","Oberkörper kippt nach vorn"],t:["Hüftbreite Spur, nicht auf einer Linie – das hilft beim Gleichgewicht."],l:"Ohne Gewicht oder als stehender Ausfallschritt am Platz."},
"Beinbeuger":{s:["Maschine so einstellen, dass das Knie an der Drehachse ist.","Polster liegt knapp über der Ferse.","Fersen kontrolliert Richtung Po ziehen.","Oben kurz halten.","Langsam zurück, ohne das Gewicht abzulegen."],a:"Beim Beugen ausatmen, beim Strecken einatmen.",f:["Hüfte hebt sich (liegend) bzw. rutscht nach vorn (sitzend)","Schwung","Gewicht knallt zurück"],t:["Langsame Rückwärtsbewegung bringt am meisten."],l:"Weniger Gewicht oder Beinbeugen auf dem Rücken mit Gymnastikball."},
"Beinstrecker":{s:["Hinsetzen, Rücken an der Lehne, Knie an der Drehachse.","Polster vorn knapp über den Knöcheln.","Beine strecken, bis sie fast gerade sind.","Oben kurz halten.","Langsam zurück."],a:"Beim Strecken ausatmen, beim Beugen einatmen.",f:["Schwung","Po hebt sich vom Sitz","Zu schwer – Knie schmerzen"],t:["Bei Knieschmerzen nur den oberen Bewegungsteil machen oder weglassen."],l:"Weniger Gewicht oder einbeinig."},
"Wadenheben":{s:["Mit den Fußballen auf eine Stufe oder Erhöhung stellen, Fersen frei.","Fersen langsam unter Stufenhöhe absenken, bis die Wade gedehnt ist.","Auf die Zehenspitzen so hoch wie möglich drücken.","Oben kurz halten, dann langsam ab."],a:"Beim Hochdrücken ausatmen, beim Absenken einatmen.",f:["Wippen und federn","Nur halbe Bewegung","Knie beugen mit"],t:["Für das Gleichgewicht mit einer Hand festhalten.","Schwerer: einbeinig oder mit Kurzhantel."],l:"Wadenheben auf flachem Boden."},
"Hip Thrust":{s:["Oberen Rücken (Schulterblätter) an eine Bank lehnen, Füße hüftbreit am Boden.","Langhantel (mit Polster) auf die Hüfte legen und festhalten.","Hüfte nach oben drücken, bis Oberkörper und Oberschenkel eine Linie bilden.","Oben Po fest anspannen, Kinn leicht zur Brust.","Kontrolliert absenken."],a:"Beim Hochdrücken ausatmen, beim Absenken einatmen.",f:["Hohlkreuz oben statt Po anspannen","Füße zu weit weg","Knie fallen nach innen"],t:["Oben sind die Schienbeine etwa senkrecht."],l:"Glute Bridge am Boden ohne Gewicht."},
"Bizepscurls":{s:["Aufrecht stehen, Kurzhanteln seitlich, Handflächen nach vorn.","Ellbogen eng am Körper lassen.","Hanteln zu den Schultern beugen.","Oben kurz anspannen.","Langsam ganz ablassen."],a:"Beim Beugen ausatmen, beim Ablassen einatmen.",f:["Schwung aus dem Rücken","Ellbogen wandern nach vorn","Nur halbe Bewegung"],t:["Langsam ablassen: 2–3 Sekunden."],l:"Weniger Gewicht, sitzend oder abwechselnd."},
"Hammercurls":{s:["Aufrecht stehen, Kurzhanteln seitlich, Handflächen zeigen zum Körper.","Ellbogen eng am Körper.","Hanteln im Hammergriff Richtung Schulter beugen.","Langsam ablassen."],a:"Beim Beugen ausatmen, beim Ablassen einatmen.",f:["Schwung","Ellbogen gehen nach vorn","Handgelenk knickt ab"],t:["Trainiert zusätzlich Unterarm und Armbeuger (Brachialis)."],l:"Weniger Gewicht oder abwechselnd."},
"Trizepsdrücken am Kabel":{s:["Vor dem Kabelzug stehen, Seil oder Stange oben eingehängt.","Oberkörper leicht nach vorn, Ellbogen eng an den Seiten.","Unterarme nach unten drücken, bis die Arme gestreckt sind.","Langsam zurück bis etwa 90° im Ellbogen."],a:"Beim Drücken ausatmen, beim Zurückgehen einatmen.",f:["Ellbogen wandern nach vorn und hinten","Mit dem Oberkörper drücken","Zu schwer"],t:["Nur die Unterarme bewegen sich."],l:"Mit Widerstandsband an der Tür."},
"Trizeps-Kickbacks":{s:["Oberkörper mit geradem Rücken nach vorn neigen, eine Hand auf Knie oder Bank stützen.","Oberarm eng am Körper, parallel zum Oberkörper.","Unterarm nach hinten strecken, bis der Arm gerade ist.","Kurz halten, langsam zurück."],a:"Beim Strecken ausatmen, beim Beugen einatmen.",f:["Oberarm bewegt sich mit","Schwung","Runder Rücken"],t:["Kleines Gewicht reicht völlig."],l:"Am Kabelzug oder mit Widerstandsband."},
"Unterarmcurls":{s:["Auf eine Bank setzen, Unterarme auf den Oberschenkeln, Handgelenke über den Knien.","Hanteln mit Handflächen nach oben halten.","Handgelenke nach unten sinken lassen.","Hanteln nur aus dem Handgelenk nach oben rollen.","Langsam zurück."],a:"Ruhig weiteratmen, beim Hochrollen ausatmen.",f:["Unterarme heben von den Beinen ab","Zu schwer","Zu schnell"],t:["Viele Wiederholungen (15–20) funktionieren gut."],l:"Leichtere Hanteln oder ein Handtuch auswringen."},
"Plank":{s:["Unterarme auf den Boden, Ellbogen unter den Schultern.","Beine nach hinten strecken, auf den Zehenspitzen stützen.","Körper in eine gerade Linie von Kopf bis Ferse bringen.","Bauch und Po fest anspannen und halten."],a:"Ruhig und gleichmäßig weiteratmen – nicht die Luft anhalten.",f:["Hüfte hängt durch","Po zu hoch","Kopf hängt"],t:["Lieber kürzer und perfekt halten als lang und durchhängend."],l:"Plank auf den Knien."},
"Crunches":{s:["Auf den Rücken legen, Knie gebeugt, Füße am Boden.","Hände vor der Brust kreuzen oder locker an die Schläfen.","Schultern und oberen Rücken einrollen und vom Boden heben.","Kurz halten, langsam zurück."],a:"Beim Hochkommen ausatmen, beim Ablegen einatmen.",f:["Am Kopf ziehen","Ganz hochkommen (Sit-up) mit Schwung","Unterer Rücken hebt ab"],t:["Kleine Bewegung, aber bewusst die Bauchmuskeln anspannen."],l:"Weniger Wiederholungen oder Hände neben dem Körper nach vorn schieben."},
"Beinheben":{s:["Auf den Rücken legen, Arme neben dem Körper, Beine gestreckt.","Unteren Rücken fest in den Boden drücken.","Beine gestreckt anheben, bis sie etwa senkrecht sind.","Langsam absenken, kurz bevor sie den Boden berühren wieder heben."],a:"Beim Heben ausatmen, beim Absenken einatmen.",f:["Hohlkreuz beim Absenken","Schwung","Zu schnell"],t:["Hängend an der Stange ist die schwere Variante."],l:"Mit gebeugten Knien."},
"Seitstütz":{s:["Auf die Seite legen, Ellbogen unter der Schulter.","Beine gestreckt übereinander.","Hüfte anheben, bis der Körper eine gerade Linie bildet.","Halten, dann Seite wechseln."],a:"Ruhig weiteratmen.",f:["Hüfte sinkt ab","Oberkörper kippt nach vorn","Schulter zieht zum Ohr"],t:["Freie Hand auf die Hüfte legen oder nach oben strecken."],l:"Seitstütz mit gebeugten Knien."},
"Russian Twist":{s:["Hinsetzen, Knie gebeugt, Fersen am Boden.","Oberkörper mit geradem Rücken etwas nach hinten lehnen.","Hände oder ein Gewicht vor der Brust halten.","Oberkörper abwechselnd nach links und rechts drehen."],a:"Bei jeder Drehung ausatmen.",f:["Runder Rücken","Nur die Arme bewegen sich","Zu schnell"],t:["Schwerer: Füße vom Boden heben."],l:"Ohne Gewicht und mit weniger Rücklage."},
"Kabelcrunch":{s:["Vor dem Kabelzug knien, Seilgriff oben eingehängt.","Seil neben dem Kopf halten.","Bauch anspannen und den Oberkörper nach unten einrollen, Ellbogen Richtung Knie.","Hüfte bleibt ruhig.","Langsam wieder aufrichten."],a:"Beim Einrollen ausatmen, beim Aufrichten einatmen.",f:["Mit den Armen ziehen","Hüfte sitzt nach hinten ab","Zu schwer"],t:["Die Bewegung kommt aus dem Bauch, nicht aus der Hüfte."],l:"Crunches am Boden."}
};
