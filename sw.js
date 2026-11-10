// Fit-Wochenplan – Offline-Zwischenspeicher
// Bei jeder neuen App-Fassung diese Kennung hochzählen (v2, v3, ...).
// Dann wirft der Browser die alte Fassung weg und lädt die neue.
const CACHE = "fitplan-v17";
const DATEIEN = ["./", "./index.html", "./essensplan.html", "./rezepte.js","./trainingssysteme.js","./laufplaene.js","./uebungen.js", "./manifest.json", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.all(DATEIEN.map(f => c.add(f).catch(() => {}))))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const namen = await caches.keys();
    await Promise.all(namen.filter(n => n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Seiten, Skripte und Daten immer zuerst aus dem Netz holen, damit Änderungen sofort ankommen.
  const istSeite = req.mode === "navigate" || /\.(html?|js|json)$/.test(url.pathname) || url.pathname.endsWith("/");
  if (istSeite) {
    e.respondWith((async () => {
      try {
        const frisch = await fetch(req);
        if (frisch.ok) {
          const c = await caches.open(CACHE);
          c.put(req, frisch.clone()).catch(() => {});
          return frisch;
        }
        // Server meldet Fehler (z. B. Datei fehlt): lieber die gespeicherte Fassung nehmen
        return (await caches.match(req)) || frisch;
      } catch (err) {
        const treffer = await caches.match(req);
        if (treffer) return treffer;
        if (req.mode === "navigate") return (await caches.match("./essensplan.html")) || Response.error();
        return Response.error();
      }
    })());
    return;
  }

  // Übriges aus dem Zwischenspeicher, sonst aus dem Netz.
  e.respondWith(
    caches.match(req).then(treffer => treffer || fetch(req).then(a => {
      if (a.ok) {
        const kopie = a.clone();
        caches.open(CACHE).then(c => c.put(req, kopie)).catch(() => {});
      }
      return a;
    }))
  );
});

// Meldung an die App, wenn der Zwischenspeicher erneuert wurde
self.addEventListener("message", e => {
  if (e.data === "update") self.skipWaiting();
});
