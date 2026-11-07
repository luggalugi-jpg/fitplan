const CACHE="fitplan-v1";
const DATEIEN=["./","./essensplan.html","./index.html"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(DATEIEN).catch(()=>{})))});
self.addEventListener("activate",e=>{e.waitUntil(self.clients.claim())});
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request).then(a=>{
  const k=a.clone();caches.open(CACHE).then(c=>c.put(e.request,k)).catch(()=>{});return a;
 }).catch(()=>caches.match("./essensplan.html"))));
});
