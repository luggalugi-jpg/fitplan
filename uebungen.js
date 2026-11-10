/* Übungs-Animationen in 3D: schattierte Figur mit Volumen, gezeichnet auf <canvas> ohne fremde Bibliotheken.
   Posen werden in der Seitenebene (x nach vorn, y nach unten) beschrieben und dann räumlich aufgebaut:
   rechte/linke Körperseite liegen auf der z-Achse. Kamera schwenkt leicht; ziehen = drehen, tippen = anhalten. */
(function(){
const L={t:38,nk:5,hd:8,ua:21,fa:19,th:29,sh:28,ft:9,wr:6,sb:11,hb:6.5};
const R=Math.PI/180,dir=a=>[Math.cos(a*R),Math.sin(a*R)],add=(p,v,k)=>[p[0]+v[0]*(k==null?1:k),p[1]+v[1]*(k==null?1:k)];
const V={a:(p,q)=>[p[0]+q[0],p[1]+q[1],p[2]+q[2]],s:(p,q)=>[p[0]-q[0],p[1]-q[1],p[2]-q[2]],m:(p,k)=>[p[0]*k,p[1]*k,p[2]*k],
 d:(p,q)=>p[0]*q[0]+p[1]*q[1]+p[2]*q[2],x:(p,q)=>[p[1]*q[2]-p[2]*q[1],p[2]*q[0]-p[0]*q[2],p[0]*q[1]-p[1]*q[0]],
 n:p=>{const l=Math.hypot(p[0],p[1],p[2])||1;return [p[0]/l,p[1]/l,p[2]/l];},len:p=>Math.hypot(p[0],p[1],p[2])};
function ik(A,T,l1,l2,s){let dx=T[0]-A[0],dy=T[1]-A[1],D=Math.hypot(dx,dy);
 D=Math.max(Math.abs(l1-l2)+.01,Math.min(l1+l2-.01,D));const b=Math.atan2(dy,dx);
 const a=Math.acos((l1*l1+D*D-l2*l2)/(2*l1*D)),g=b+(s||1)*a;
 return [[A[0]+l1*Math.cos(g),A[1]+l1*Math.sin(g)],[A[0]+D*Math.cos(b),A[1]+D*Math.sin(b)]];}
function ik3(A,T,l1,l2,pole){const d=V.s(T,A);let D=V.len(d);D=Math.max(Math.abs(l1-l2)+.01,Math.min(l1+l2-.01,D));
 const u=V.n(d);let p=V.s(pole,V.m(u,V.d(pole,u)));p=V.len(p)<1e-4?[0,1,0]:V.n(p);
 const a=Math.acos((l1*l1+D*D-l2*l2)/(2*l1*D));
 return [V.a(A,V.a(V.m(u,l1*Math.cos(a)),V.m(p,l1*Math.sin(a)))),V.a(A,V.m(u,D))];}
function loc(p,A,B,o){const dx=B[0]-A[0],dy=B[1]-A[1],n=Math.hypot(dx,dy)||1,u=[dx/n,dy/n],v=[-u[1],u[0]];
 return [p[0]+u[0]*o[0]+v[0]*o[1],p[1]+u[1]*o[0]+v[1]*o[1]];}
/* Pose → 2D-Gelenke (Mittellinie) und 3D-Gelenke */
function pose(P){const J2={},J={};
 J2.h=P.h;const td=dir(P.t);J2.s=add(P.h,td,L.t);J2.hd=add(J2.s,dir(P.t+(P.n||0)),L.nk+L.hd);J2.nk=add(J2.s,dir(P.t+(P.n||0)),L.nk+1);
 const roll=(P.roll||0)*R,lat=[0,Math.sin(roll),Math.cos(roll)];
 const u=[td[0],td[1],0],tw=(P.tw||0)*R,latS=V.a(V.m(lat,Math.cos(tw)),V.m(V.n(V.x(u,lat)),Math.sin(tw)));
 const up=(p,v,k)=>[p[0]+v[0]*k,p[1]+v[1]*k,v[2]*k];
 J.hc=up(J2.h,lat,0);J.sc=up(J2.s,latS,0);J.hd=up(J2.hd,latS,0);J.nk=up(J2.nk,latS,0);
 J.s=up(J2.s,latS,L.sb);J.s2=up(J2.s,latS,-L.sb);J.hp=up(J2.h,lat,L.hb);J.hp2=up(J2.h,lat,-L.hb);
 const tgt=(abs,rel,hrel)=>abs?abs:(rel?loc(J2.s,J2.h,J2.s,rel):(hrel?add(J2.h,hrel):null));
 const a1=tgt(P.a,P.ar,P.ah),a2=tgt(P.a2,P.ar2,P.ah2)||a1;
 // Arme
 if(P.a3){const pole=P.pole||[0,1,0];let r=ik3(J.s,P.a3,L.ua,L.fa,pole);J.e=r[0];J.a=r[1];
  const b=P.a3b||[P.a3[0],P.a3[1],-P.a3[2]],pole2=P.pole2||[pole[0],pole[1],-pole[2]];r=ik3(J.s2,b,L.ua,L.fa,pole2);J.e2=r[0];J.a2=r[1];}
 else{let r=ik(J2.s,a1,L.ua,L.fa,P.eb==null?1:P.eb);J.e=up(r[0],latS,L.sb);J.a=up(r[1],latS,L.sb);J2.a=r[1];
  r=ik(J2.s,a2,L.ua,L.fa,P.eb2!=null?P.eb2:(P.eb==null?1:P.eb));J.e2=up(r[0],latS,-L.sb);J.a2=up(r[1],latS,-L.sb);}
 if(P.a3x){const r=ik3(J.s,P.a3x,L.ua,L.fa,P.polex||[0,1,0]);J.e=r[0];J.a=r[1];}
 // Beine
 const f1=P.f||add(P.h,P.fr),f2=P.f2||(P.fr2?add(P.h,P.fr2):f1);
 let r=ik(J2.h,f1,L.th,L.sh,P.kb==null?-1:P.kb);J2.k=r[0];J2.f=r[1];
 const r2=ik(J2.h,f2,L.th,L.sh,P.kb2!=null?P.kb2:(P.kb==null?-1:P.kb));
 J.k=up(r[0],lat,L.hb);J.f=up(r[1],lat,L.hb);J.k2=up(r2[0],lat,-L.hb);J.f2=up(r2[1],lat,-L.hb);
 const ft=P.ft||0,ft2=P.ft2!=null?P.ft2:ft;
 J.t=up(add(r[1],dir(ft),L.ft),lat,L.hb);J.he=up(add(r[1],dir(ft+180),3),lat,L.hb);
 J.t2=up(add(r2[1],dir(ft2),L.ft),lat,-L.hb);J.he2=up(add(r2[1],dir(ft2+180),3),lat,-L.hb);
 if(P.wr!=null){const w=dir(P.wr);J.w=V.a(J.a,[w[0]*L.wr,w[1]*L.wr,0]);J.w2=V.a(J.a2,[w[0]*L.wr,w[1]*L.wr,0]);}
 J.lat=lat;J.latS=latS;return {J,J2};}
/* ---------- Farben ---------- */
function hex(c){c=(c||"").trim();if(c[0]=="#"){if(c.length==4)c="#"+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];return [1,3,5].map(i=>parseInt(c.slice(i,i+2),16));}
 const m=c.match(/[\d.]+/g);return m?m.slice(0,3).map(Number):[128,128,128];}
const sh=(c,k)=>`rgb(${c.map(v=>Math.max(0,Math.min(255,Math.round(k>1?v+(255-v)*(k-1):v*k)))).join(",")})`;
let COL=null;
function farben(){const g=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
 const dunkel=hex(g("--bg")||"#fff").reduce((a,b)=>a+b,0)<300;
 COL={koerper:hex("#d3d4d6"),haar:hex("#55595e"),rot:hex("#c9342b"),rot2:hex("#e89a8f"),
  metall:hex("#cfd3d6"),scheibe:hex("#2a2b2d"),polster:hex("#2b2c2f"),geraet:hex("#d8dadc"),
  boden:hex(g("--line")||"#e1e5dc"),dunkel};}
/* ---------- Kamera ---------- */
function cam(yaw,pitch){const cy=Math.cos(yaw*R),sy=Math.sin(yaw*R),cp=Math.cos(pitch*R),sp=Math.sin(pitch*R),F=520,S=1.02;
 return p=>{const X=p[0]-100,Y=p[1]-92,Z=p[2];const x=X*cy-Z*sy,d=X*sy+Z*cy;const y=Y*cp+d*sp,d2=d*cp-Y*sp;
  const k=F/(F-d2)*S;return [100+x*k,86+y*k,d2,k];};}
/* ---------- Grundformen ---------- */
function bauen(def,P){const {J,J2}=pose(P),C=COL,out=[];
 const cap=(a,b,r,c,seg)=>{const l=V.len(V.s(b,a)),n=seg||Math.max(1,Math.ceil(l/16));
  for(let i=0;i<n;i++){out.push({t:"c",a:V.a(a,V.m(V.s(b,a),i/n)),b:V.a(a,V.m(V.s(b,a),(i+1)/n)),r,c,e0:i==0,e1:i==n-1});}};
 const sph=(p,r,c)=>out.push({t:"s",p,r,c});
 const disc=(c,r,th,col)=>out.push({t:"d",p:c,r,th,c:col});
 const box=(o,ax,ay,az,col)=>{ // o = Ecke, ax/ay/az = Kantenvektoren
  const P8=[];for(let i=0;i<8;i++)P8.push(V.a(o,V.a(V.m(ax,i&1),V.a(V.m(ay,(i>>1)&1),V.m(az,(i>>2)&1)))));
  [[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]].forEach(f=>out.push({t:"p",pts:f.map(i=>P8[i]),c:col}));};
 const z2=(p,z)=>[p[0],p[1],z||0];
 const bar=(c,zl,r,col)=>cap([c[0],c[1],-zl],[c[0],c[1],zl],r,col,Math.ceil(zl/6));
 const mid=(p,q)=>V.m(V.a(p,q),.5);
 /* Geräte */
 (def.p||[]).forEach(p=>{
  const j2=k=>{let q=J2[k]||[J[k][0],J[k][1]];if(p.o)q=p.fr?loc(q,J2[p.fr[0]],J2[p.fr[1]],p.o):add(q,p.o);return q;};
  if(p.r){const zw=p.zw||12;box([p.r[0],p.r[1],-zw],[p.r[2],0,0],[0,p.r[3],0],[0,0,2*zw],p.farbe=="g"?C.geraet:C.polster);}
  else if(p.l){const a=[p.l[0],p.l[1]],b=[p.l[2],p.l[3]];
   if(p.slab){const zw=p.zw||11,d=[b[0]-a[0],b[1]-a[1]],n=Math.hypot(d[0],d[1]),w=p.w||5,v=[-d[1]/n*w,d[0]/n*w];
    box([a[0]-v[0]/2,a[1]-v[1]/2,-zw],[d[0],d[1],0],[v[0],v[1],0],[0,0,2*zw],C.polster);}
   else (p.z||[-9,9]).forEach(z=>cap(z2(a,z),z2(b,z),(p.w||3)*.55,C.geraet));}
  else if(p.c){bar(p.c,p.zl||16,p.c[2],p.metall?C.metall:C.polster);}
  else if(p.plate){let c;if(p.at=="a")c=[(J.a[0]+J.a2[0])/2,(J.a[1]+J.a2[1])/2];else c=j2(p.at=="s"?"s":p.at);
   bar(c,34,1.5,C.metall);[-1,1].forEach(s=>{disc([c[0],c[1],s*25],p.rr||11,4,C.scheibe);cap([c[0],c[1],s*21.5],[c[0],c[1],s*22.5],2.6,C.metall,1);});}
  else if(p.db){[p.at,p.one?null:(p.at+"2")].forEach(k=>{if(!k||!J[k])return;const h=J[k];
   cap(V.a(h,[0,0,-4.5]),V.a(h,[0,0,4.5]),1.3,C.metall,1);[-1,1].forEach(s=>disc(V.a(h,[0,0,s*6]),p.rr||5,3,C.scheibe));});}
  else if(p.bar){const c=mid(J.a,J.a2);cap(V.a(c,[0,0,-24]),V.a(c,[0,0,24]),1.4,C.metall,6);}
  else if(p.cable){const q=p.one?J.a:mid(J.a,J.a2),pl=[p.cable[0],p.cable[1],0];
   out.push({t:"l",a:pl,b:q,c:C.geraet});if(!p.one&&!p.bar2){out.push({t:"l",a:q,b:J.a,c:C.geraet});out.push({t:"l",a:q,b:J.a2,c:C.geraet});}
   sph(pl,3.6,C.metall);}
  else if(p.pad){const q=j2(p.at);bar(q,p.zl||12,p.rr||5,C.polster);}
  else if(p.sled){const q=j2(p.at),u=dir(p.ang||0),a=add(q,u,-14),b=add(q,u,14),d=[b[0]-a[0],b[1]-a[1]],n=28,v=[-d[1]/n*4,d[0]/n*4];
   box([a[0],a[1],-15],[d[0],d[1],0],[v[0],v[1],0],[0,0,30],C.geraet);}
  else if(p.ball){sph(mid(J.a,J.a2),p.rr||7,C.scheibe);}
 });
 /* Figur im Anatomie-Stil: graue Grundform, Muskeln als eigene Wölbungen; trainierte Muskeln rot */
 const M1=new Set(def.m||[]),M2=new Set(def.m2||[]),G=C.koerper,rot=m=>M1.has(m)?C.rot:(M2.has(m)?C.rot2:G);
 const u=V.n(V.s(J.sc,J.hc));let F=V.n(V.x(J.lat,u));if(P.bauch)F=V.m(F,-1);const la=J.lat;
 const perp=(v,d)=>{const n=V.n(d);return V.s(v,V.m(n,V.d(v,n)));};
 const seite=(a,b,c,fb)=>{let p=perp(c,V.s(b,a));if(V.len(p)<.25*(V.len(c)||1))p=perp(fb,V.s(b,a));return V.n(p);};
 const P3=(o,...t)=>t.reduce((q,[v,k])=>V.a(q,V.m(v,k)),o),lp=(a,b,t)=>V.a(a,V.m(V.s(b,a),t));
 const mus=(a,b,t0,t1,off,r,m,n)=>cap(V.a(lp(a,b,t0),off),V.a(lp(a,b,t1),off),r,rot(m),n||1);
 // Kopf, Hals, Rumpf
 sph(J.hd,8,G);sph(P3(J.hd,[u,2.3],[F,-2.8]),6.9,C.haar);cap(J.sc,J.nk,3.4,G,1);
 cap(J.hc,J.sc,7.6,G,3);cap(J.hp,J.s,5.2,G,3);cap(J.hp2,J.s2,5.2,G,3);cap(J.s,J.s2,4.6,G,2);cap(J.hp,J.hp2,6,G,1);
 [1,-1].forEach(k=>{
  cap(P3(J.sc,[u,-13],[F,4],[la,k*3.4]),P3(J.sc,[u,-5],[F,3.6],[la,k*8.5]),5.1,rot("brust"),1);
  cap(P3(J.hc,[u,5],[F,4.6],[la,k*2.4]),P3(J.hc,[u,23],[F,4.6],[la,k*2.6]),3.3,rot("bauch"),2);
  cap(P3(J.hc,[u,5],[F,1],[la,k*7]),P3(J.hc,[u,21],[F,1.4],[la,k*8.4]),3.7,rot("seite"),2);
  cap(P3(J.hc,[u,12],[F,-2.8],[la,k*6.4]),P3(J.sc,[u,-6],[F,-2.6],[la,k*9.4]),5.3,rot("lat"),2);
  cap(P3(J.sc,[F,-3],[la,k*5]),P3(J.nk,[F,-1.8],[la,k*1.6]),3.5,rot("trap"),1);
  cap(P3(J.hc,[u,2],[F,-4.8],[la,k*2.5]),P3(J.hc,[u,21],[F,-4.4],[la,k*2.5]),2.9,rot("ery"),2);
  sph(P3(k>0?J.hp:J.hp2,[F,-4],[u,1]),6,rot("glut"));});
 // Arme
 [["s","e","a","w"],["s2","e2","a2","w2"]].forEach(([s,e,a,w])=>{const fr=seite(J[s],J[e],V.s(J[a],J[e]),F);
  sph(J[s],6,rot("delt"));cap(J[s],J[e],3.1,G,2);
  mus(J[s],J[e],.18,.82,V.m(fr,1.6),3.5,"bizeps");mus(J[s],J[e],.1,.85,V.m(fr,-1.8),3.6,"tri");
  cap(J[e],J[a],2.4,G,2);mus(J[e],J[a],.06,.55,[0,0,0],3.4,"unterarm");sph(J[a],2.9,G);if(J[w])cap(J[a],J[w],2.3,G,1);});
 // Beine
 [["hp","k","f","t","he"],["hp2","k2","f2","t2","he2"]].forEach(([h,k,f,t,he])=>{
  const bk=seite(J[h],J[k],V.s(J[f],J[k]),V.m(F,-1)),bs=seite(J[k],J[f],V.s(J[h],J[k]),V.m(F,-1));
  cap(J[h],J[k],4.5,G,2);mus(J[h],J[k],.1,.86,V.m(bk,-2.4),5.2,"quad",2);mus(J[h],J[k],.14,.84,V.m(bk,2.3),4.7,"ham",2);
  cap(J[k],J[f],3.1,G,2);mus(J[k],J[f],.1,.55,V.m(bs,1.8),4.2,"wade");cap(J[he],J[t],2.5,G,1);});
 return {out,J};}
/* ---------- Zeichnen ---------- */
function zeichnen(ctx,def,P,yaw,pitch){if(!COL)farben();const C=COL,pr=cam(yaw,pitch),{out,J}=bauen(def,P);
 ctx.clearRect(0,0,200,150);
 // Boden
 ctx.lineWidth=.5;ctx.strokeStyle=sh(C.boden,C.dunkel?1.1:.96);
 for(let x=-20;x<=220;x+=20){const a=pr([x,141,-70]),b=pr([x,141,70]);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
 for(let z=-70;z<=70;z+=20){const a=pr([-20,141,z]),b=pr([220,141,z]);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
 // Schatten
 const xs=[J.hc,J.sc,J.f,J.f2,J.a].map(p=>p[0]),cx=(Math.min(...xs)+Math.max(...xs))/2,wx=Math.max(30,Math.max(...xs)-Math.min(...xs));
 const sc=pr([cx,141,0]);ctx.save();ctx.translate(sc[0],sc[1]);ctx.scale(1,.28);
 const g0=ctx.createRadialGradient(0,0,0,0,0,wx*.62*sc[3]);g0.addColorStop(0,"rgba(0,0,0,.28)");g0.addColorStop(1,"rgba(0,0,0,0)");
 ctx.fillStyle=g0;ctx.beginPath();ctx.arc(0,0,wx*.62*sc[3],0,7);ctx.fill();ctx.restore();
 // Elemente projizieren und von hinten nach vorn sortieren
 const items=out.map(o=>{
  if(o.t=="c"){const a=pr(o.a),b=pr(o.b);return {o,a,b,z:(a[2]+b[2])/2};}
  if(o.t=="s"){const p=pr(o.p);return {o,p,z:p[2]+o.r*.3};}
  if(o.t=="l"){const a=pr(o.a),b=pr(o.b);return {o,a,b,z:Math.max(a[2],b[2])-6};}
  if(o.t=="d"){const pts=[];for(let i=0;i<20;i++){const w=i/20*Math.PI*2;pts.push(pr([o.p[0]+Math.cos(w)*o.r,o.p[1]+Math.sin(w)*o.r,o.p[2]]));}
   const f=pr([o.p[0],o.p[1],o.p[2]+o.th/2]),b=pr([o.p[0],o.p[1],o.p[2]-o.th/2]);return {o,pts,f,b,z:pr(o.p)[2]};}
  if(o.t=="p"){const pts=o.pts.map(pr);let ar=0;for(let i=0;i<4;i++){const p=pts[i],q=pts[(i+1)%4];ar+=p[0]*q[1]-q[0]*p[1];}
   if(ar<=0)return null;const n=V.n(V.x(V.s(o.pts[1],o.pts[0]),V.s(o.pts[3],o.pts[0])));
   const li=Math.max(0,V.d(n,V.n([-.35,-1,.55])));return {o,pts,li,z:pts.reduce((s,p)=>s+p[2],0)/4-1};}
 }).filter(Boolean).sort((a,b)=>a.z-b.z);
 const lichtN=(ax,ay)=>{let n=[-ay,ax];const l=Math.hypot(n[0],n[1])||1;n=[n[0]/l,n[1]/l];if(n[0]*-.55+n[1]*-.83<0)n=[-n[0],-n[1]];return n;};
 items.forEach(it=>{const o=it.o;
  if(o.t=="c"){const a=it.a,b=it.b,r=o.r*(a[3]+b[3])/2,dx=b[0]-a[0],dy=b[1]-a[1],n=lichtN(dx,dy),m=[(a[0]+b[0])/2,(a[1]+b[1])/2];
   const g=ctx.createLinearGradient(m[0]-n[0]*r,m[1]-n[1]*r,m[0]+n[0]*r,m[1]+n[1]*r);
   g.addColorStop(0,sh(o.c,.6));g.addColorStop(.5,sh(o.c,.97));g.addColorStop(.8,sh(o.c,1.14));g.addColorStop(1,sh(o.c,.9));
   const UM="rgba(40,40,44,.4)";ctx.strokeStyle=UM;ctx.fillStyle=UM;ctx.lineWidth=2*r+1;
   ctx.lineCap=o.e0&&o.e1?"round":"butt";ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0]+(Math.abs(dx)+Math.abs(dy)<.01?.01:0),b[1]);ctx.stroke();
   if(!(o.e0&&o.e1)){if(o.e0){ctx.beginPath();ctx.arc(a[0],a[1],r+.5,0,7);ctx.fill();}if(o.e1){ctx.beginPath();ctx.arc(b[0],b[1],r+.5,0,7);ctx.fill();}}
   ctx.lineCap="round";ctx.strokeStyle=g;ctx.lineWidth=2*r;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0]+(Math.abs(dx)+Math.abs(dy)<.01?.01:0),b[1]);ctx.stroke();}
  else if(o.t=="s"){const p=it.p,r=o.r*p[3],g=ctx.createRadialGradient(p[0]-r*.35,p[1]-r*.4,r*.1,p[0],p[1],r);
   g.addColorStop(0,sh(o.c,1.2));g.addColorStop(.6,sh(o.c,.97));g.addColorStop(1,sh(o.c,.62));ctx.fillStyle="rgba(40,40,44,.4)";ctx.beginPath();ctx.arc(p[0],p[1],r+.5,0,7);ctx.fill();ctx.fillStyle=g;ctx.beginPath();ctx.arc(p[0],p[1],r,0,7);ctx.fill();}
  else if(o.t=="l"){ctx.strokeStyle=sh(o.c,.8);ctx.lineWidth=1.1;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(it.a[0],it.a[1]);ctx.lineTo(it.b[0],it.b[1]);ctx.stroke();}
  else if(o.t=="d"){const vorn=it.f[2]>it.b[2]?it.f:it.b,hin=vorn==it.f?it.b:it.f,off=[hin[0]-vorn[0],hin[1]-vorn[1]];
   ctx.fillStyle=sh(o.c,.7);ctx.beginPath();it.pts.forEach((p,i)=>{const x=p[0]+off[0]*.5,y=p[1]+off[1]*.5;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.fill();
   const r=o.r*vorn[3],g=ctx.createRadialGradient(vorn[0]-r*.4,vorn[1]-r*.5,r*.1,vorn[0],vorn[1],r*1.1);
   g.addColorStop(0,sh(o.c,1.9));g.addColorStop(.7,sh(o.c,1.05));g.addColorStop(1,sh(o.c,.8));ctx.fillStyle=g;
   ctx.beginPath();it.pts.forEach((p,i)=>{const x=p[0]-off[0]*.5,y=p[1]-off[1]*.5;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.fill();}
  else if(o.t=="p"){ctx.fillStyle=sh(o.c,.55+.6*it.li);ctx.strokeStyle="rgba(40,40,44,.45)";ctx.lineWidth=.5;ctx.lineJoin="round";
   ctx.beginPath();it.pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();ctx.stroke();}
 });}
/* ---------- Ablauf ---------- */
function lerp(a,b,x){if(typeof a=="number"&&typeof b=="number")return a+(b-a)*x;
 if(Array.isArray(a)&&Array.isArray(b))return a.map((v,i)=>lerp(v,b[i],x));return x<.5?a:b;}
function mix(A,B,x){const o={};new Set(Object.keys(A).concat(Object.keys(B))).forEach(k=>{o[k]=(k in A&&k in B)?lerp(A[k],B[k],x):(k in B?B[k]:A[k]);});return o;}
const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
function phase(def,ms){const mv=def.d||1100,hA=def.hA!=null?def.hA:350,hB=def.hB!=null?def.hB:350,T=hA+mv+hB+mv;
 let t=ms%T;if(t<hA)return 0;t-=hA;if(t<mv)return ease(t/mv);t-=mv;if(t<hB)return 1;t-=hB;return 1-ease(t/mv);}
const poseBei=(def,x)=>mix(def.k[0],Object.assign({},def.k[0],def.k[1]),x);
function leinwand(cv){const dpr=Math.min(3,window.devicePixelRatio||1),w=cv.clientWidth||340;cv.width=Math.round(w*dpr);cv.height=Math.round(w*.75*dpr);
 const ctx=cv.getContext("2d");ctx.setTransform(cv.width/200,0,0,cv.height/150,0,0);return ctx;}
window.uebAnimDraw=function(cv,def,x,yaw){COL=null;const ctx=leinwand(cv);zeichnen(ctx,def,poseBei(def,x),yaw!=null?yaw:(def.yaw!=null?def.yaw:28),def.pitch!=null?def.pitch:13);};
let laeuft=null;
window.uebAnimStart=function(el,def){uebAnimStop();if(!el||!def)return;COL=null;
 const cv=document.createElement("canvas");cv.style.cssText="width:100%;max-width:380px;aspect-ratio:4/3;display:block;margin:0 auto;touch-action:pan-y;cursor:grab";
 cv.setAttribute("role","img");cv.setAttribute("aria-label","3D-Animation der Übung");el.innerHTML="";el.appendChild(cv);
 const ctx=leinwand(cv),ruhig=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
 const st={pause:ruhig,t:0,last:performance.now(),dreh:0,gezogen:false,x0:null,bew:0,yaw0:def.yaw!=null?def.yaw:28};
 cv.addEventListener("pointerdown",e=>{st.x0=e.clientX;st.bew=0;try{cv.setPointerCapture(e.pointerId);}catch(_){}});
 cv.addEventListener("pointermove",e=>{if(st.x0==null)return;const dx=e.clientX-st.x0;st.x0=e.clientX;st.bew+=Math.abs(dx);if(st.bew>4){st.dreh+=dx*.7;st.gezogen=true;}});
 const ende=()=>{if(st.x0!=null&&st.bew<=4)st.pause=!st.pause;st.x0=null;};
 cv.addEventListener("pointerup",ende);cv.addEventListener("pointercancel",()=>{st.x0=null;});
 const tick=now=>{if(!cv.isConnected){laeuft=null;return;}
  const dt=now-st.last;st.last=now;if(!st.pause)st.t+=dt;
  const schwenk=st.gezogen?0:Math.sin(st.t/2600)*14;
  zeichnen(ctx,def,poseBei(def,ruhig?1:phase(def,st.t)),st.yaw0+st.dreh+schwenk,def.pitch!=null?def.pitch:13);
  laeuft=requestAnimationFrame(tick);};
 laeuft=requestAnimationFrame(tick);};
window.uebAnimStop=function(){if(laeuft)cancelAnimationFrame(laeuft);laeuft=null;};
})();
/* Bewegungen je Übung: k[0] = Startposition, k[1] = Änderungen für die Endposition, p = Geräte, yaw/pitch = Kamerawinkel */
const ST={h:[100,80],t:-90,f:[100,137],ft:0};
window.UEB_ANIM={
"Kniebeugen":{m:["quad", "glut"],m2:["ham", "ery"],k:[{h:[98,80],t:-88,f:[102,137],ar:[2,-6],eb:1},{h:[80,110],t:-52}],p:[{plate:1,at:"s",fr:["h","s"],o:[1,-8]}]},
"Bankdrücken":{m:["brust"],m2:["tri", "delt"],k:[{h:[122,99],t:180,a:[84,59],eb:-1,f:[150,137]},{a:[90,89]}],p:[{r:[48,104,86,7]},{l:[60,111,60,140]},{l:[124,111,124,140]},{plate:1,at:"a"}]},
"Schrägbankdrücken":{m:["brust"],m2:["delt", "tri"],k:[{h:[118,101],t:-145,a:[93,41],eb:-1,f:[150,137]},{a:[99,71]}],p:[{l:[126,110,80,78],slab:1,w:6},{r:[100,105,30,6]},{l:[115,111,115,140]},{plate:1,at:"a"}]},
"Kurzhantel-Flys":{m:["brust"],m2:["delt"],yaw:42,pitch:22,k:[{h:[122,99],t:180,a3:[86,62,7],pole:[0,.4,1],f:[150,137]},{a3:[88,94,46]}],p:[{r:[48,104,86,7]},{l:[60,111,60,140]},{l:[124,111,124,140]},{db:1,at:"a"}]},
"Liegestütze":{m:["brust", "tri"],m2:["delt", "bauch"],k:[{bauch:1,h:[105,111],t:-158,a:[72,137],eb:1,f:[163,132],ft:115},{h:[110,125],t:-172}]},
"Dips":{m:["brust", "tri"],m2:["delt"],k:[{h:[95,73],t:-80,a:[100,77],eb:1,fr:[-14,36],ft:60},{h:[93,88],t:-70}],p:[{l:[68,80,136,80],w:4,z:[-12,12]},{l:[76,80,76,140],z:[-12,12]},{l:[128,80,128,140],z:[-12,12]}]},
"Schulterdrücken":{m:["delt"],m2:["tri", "trap"],k:[{h:[92,98],t:-90,ar:[2,9],eb:1,f:[126,137]},{ar:[37,3]}],p:[{r:[76,102,36,7]},{l:[94,109,94,140],z:[0]},{l:[80,102,80,52],slab:1,w:5},{plate:1,at:"a"}]},
"Seitheben":{m:["delt"],m2:["trap"],yaw:62,k:[{...ST,a3:[101,82,17],pole:[-1,.3,0]},{a3:[101,47,52]}],p:[{db:1,at:"a"}]},
"Frontheben":{m:["delt"],m2:["brust"],k:[{...ST,ar:[-37,5],eb:1},{ar:[0,38]}],p:[{db:1,at:"a"}]},
"Face Pulls":{m:["delt", "trap"],m2:["bizeps"],k:[{h:[95,80],t:-92,f:[100,137],f2:[86,137],a:[136,41],eb:-1},{a:[106,31]}],p:[{l:[172,10,172,140],w:5,z:[0]},{cable:[168,38],at:"a"}]},
"Klimmzüge":{m:["lat"],m2:["bizeps", "trap"],k:[{h:[95,90],t:-87,a:[100,14],eb:-1,fr:[-14,42],ft:60},{h:[95,60]}],p:[{c:[100,14,2],zl:34,metall:1},{l:[100,14,100,-10],z:[-34,34]}]},
"Latzug":{m:["lat"],m2:["bizeps"],k:[{h:[94,100],t:-92,a:[104,28],eb:1,f:[124,137]},{t:-102,a:[108,64]}],p:[{r:[78,104,34,7]},{l:[95,111,95,140],z:[0]},{c:[124,88,5],zl:13},{bar:1},{cable:[100,4],bar2:1}]},
"Rudern mit Langhantel":{m:["lat", "trap"],m2:["bizeps", "ery"],k:[{h:[82,84],t:-30,a:[112,104],eb:1,f:[100,137]},{a:[100,86]}],p:[{plate:1,at:"a"}]},
"Rudern mit Kurzhantel":{m:["lat"],m2:["bizeps", "trap"],k:[{h:[78,80],t:-20,a:[111,105],a2:[116,108],eb:1,eb2:1,f:[92,136],f2:[48,107]},{a:[92,82]}],p:[{r:[40,108,84,7],zw:14},{l:[50,115,50,140]},{l:[114,115,114,140]},{db:1,at:"a",one:1}]},
"Kreuzheben":{m:["ery", "glut", "ham"],m2:["quad", "trap"],k:[{h:[78,106],t:-28,a:[106,127],eb:1,f:[100,137]},{h:[98,80],t:-92,a:[101,84]}],p:[{plate:1,at:"a"}]},
"Rückenstrecken":{m:["ery"],m2:["glut", "ham"],k:[{h:[105,80],t:75,ar:[-12,8],eb:1,f:[65,118],ft:60},{t:-43}],p:[{c:[110,85,6],zl:12},{l:[110,91,110,140],w:4,z:[0]},{l:[58,113,68,127],slab:1,w:4},{l:[63,120,63,140],w:4,z:[0]}]},
"Beinpresse":{m:["quad"],m2:["glut"],k:[{h:[75,112],t:-140,a:[74,118],eb:1,f:[110,77],ft:-135},{f:[95,92]}],p:[{l:[86,112,166,32],w:3,z:[-15,15]},{l:[82,121,38,85],slab:1,w:6},{r:[46,120,64,20],farbe:"g"},{sled:1,at:"f",o:[2,-2],ang:45}]},
"Ausfallschritte":{m:["quad", "glut"],m2:["ham"],k:[{h:[98,80],t:-90,f:[100,137],f2:[98,137],ar:[-37,2],eb:1},{h:[98,108],t:-88,f:[128,137],f2:[70,132],ft2:32}],p:[{db:1,at:"a"}]},
"Beinbeuger":{m:["ham"],m2:["wade"],k:[{bauch:1,h:[97,99],t:180,a:[44,110],eb:-1,f:[152,99],kb:1,ft:80},{f:[124,72],ft:0}],p:[{r:[36,104,96,7]},{l:[50,111,50,140]},{l:[120,111,120,140]},{pad:1,at:"f",fr:["k","f"],o:[-3,-7]}]},
"Beinstrecker":{m:["quad"],m2:[],k:[{h:[90,100],t:-95,a:[96,102],eb:1,f:[117,128],ft:60},{f:[146,97],ft:-30}],p:[{r:[72,104,36,7]},{l:[78,104,74,56],slab:1,w:5},{l:[90,111,90,140],z:[0]},{pad:1,at:"f",fr:["k","f"],o:[-4,-7]}]},
"Wadenheben":{m:["wade"],m2:[],k:[{h:[99,74],t:-90,f:[99,131],ft:-20,ar:[-37,1],eb:1},{h:[101,62],f:[101,119],ft:63}],p:[{r:[101,128,40,13],zw:18,farbe:"g"}]},
"Hip Thrust":{m:["glut"],m2:["ham"],k:[{h:[102,124],t:-142,f:[132,137],ah:[3,-10],eb:1},{h:[110,99],t:180}],p:[{r:[30,95,46,9]},{l:[40,104,40,140]},{l:[68,104,68,140]},{plate:1,at:"h",o:[0,-10]}]},
"Bizepscurls":{m:["bizeps"],m2:["unterarm"],k:[{...ST,ar:[-37,3],eb:1},{ar:[-8,13]}],p:[{db:1,at:"a"}]},
"Hammercurls":{m:["bizeps", "unterarm"],m2:[],k:[{...ST,ar:[-37,3],eb:1},{ar:[-8,13]}],p:[{db:1,at:"a"}]},
"Trizepsdrücken am Kabel":{m:["tri"],m2:[],k:[{h:[98,80],t:-84,f:[100,137],f2:[92,137],ar:[-14,14],eb:1},{ar:[-36,10]}],p:[{l:[152,8,152,140],w:5,z:[0]},{cable:[147,14],at:"a"}]},
"Trizeps-Kickbacks":{m:["tri"],m2:[],k:[{h:[84,84],t:-18,a:[104,103],a2:[110,104],eb:1,f:[102,137],f2:[96,137]},{a:[82,86]}],p:[{db:1,at:"a",one:1}]},
"Unterarmcurls":{m:["unterarm"],m2:[],k:[{h:[84,101],t:-62,a:[117,101],eb:1,f:[116,137],wr:60},{wr:-35}],p:[{r:[64,104,38,7]},{l:[82,111,82,140],z:[0]},{db:1,at:"w"}]},
"Plank":{m:["bauch"],m2:["delt", "seite"],hB:1800,k:[{bauch:1,h:[107,134],t:-154,a:[88,138],eb:1,f:[163,132],ft:115},{h:[107,124],t:-168}]},
"Crunches":{m:["bauch"],m2:[],k:[{h:[100,133],t:180,ar:[-11,5],eb:1,f:[128,137]},{t:-152}]},
"Beinheben":{m:["bauch"],m2:["quad"],k:[{h:[108,133],t:180,a:[146,136],eb:1,f:[164,129],ft:-5},{f:[112,77],ft:-88}]},
"Seitstütz":{m:["seite"],m2:["bauch", "delt"],hB:1800,yaw:14,k:[{roll:90,h:[106,124],t:-150,a3:[70,138,18],pole:[0,1,0],a3b:[103,112,8],pole2:[-.3,-1,.4],f:[163,129],ft:-90},{h:[107,113],t:-165}]},
"Russian Twist":{m:["seite", "bauch"],m2:[],yaw:50,k:[{h:[100,127],t:-128,f:[128,134],kb:-1,tw:-28,a3:[97,108,-12],pole:[0,1,0],a3b:[97,108,-22],pole2:[0,1,0]},{tw:28,a3:[97,108,22],a3b:[97,108,12]}],p:[{ball:1}]},
"Kabelcrunch":{m:["bauch"],m2:["seite"],k:[{h:[100,108],t:-86,ar:[2,8],eb:1,f:[71,137],ft:180},{h:[96,106],t:15,ar:[-2,10]}],p:[{l:[88,4,88,140],w:5,z:[0]},{cable:[94,10],at:"a"}]}
};
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
