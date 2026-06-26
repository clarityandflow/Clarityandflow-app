const CACHE = "cf-app-v7";
const ASSETS = ["/", "/index.html", "/manifest.json", "/icon-192.png", "/icon-512.png", "/icon-180.png", "/og-image.png"];
self.addEventListener("install", (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {})); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put("/index.html", cp)); return r; }).catch(() => caches.match("/index.html")));
    return;
  }
  e.respondWith(caches.match(req).then((c) => c || fetch(req).then((r) => { const cp = r.clone(); caches.open(CACHE).then((ca) => ca.put(req, cp)); return r; })));
});
