// Offline support: always try the newest page first; at sea with no internet, use the last saved copy.
const CACHE = "cruise2027";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.add("./"))); });
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: "no-store" })
      .then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request.mode === "navigate" ? "./" : e.request, copy)); } return r; })
      .catch(() => caches.match(e.request.mode === "navigate" ? "./" : e.request).then(m => m || caches.match("./")))
  );
});
