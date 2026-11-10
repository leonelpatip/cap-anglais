/* Service worker : met l'application en cache pour un fonctionnement hors ligne.
   Pensez à incrémenter VERSION à chaque mise en ligne d'une nouvelle version. */
const VERSION = "cap-anglais-v5";
const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/app.css",
  "./js/config.js",
  "./js/data/placement.js",
  "./js/data/lessons.js",
  "./js/data/vocab.js",
  "./js/data/readings.js",
  "./js/data/tips.js",
  "./js/core.js",
  "./js/auth.js",
  "./js/plan.js",
  "./js/ui.js",
  "./js/player.js",
  "./js/program.js",
  "./js/views.js",
  "./js/app.js",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./assets/apple-touch-icon.png"
];

/* Chaque fichier est mis en cache séparément : un fichier manquant ne bloque pas l'installation. */
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => Promise.allSettled(FILES.map(f => c.add(new Request(f, { cache: "reload" })))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Polices Google : servies depuis le cache, mises à jour en arrière-plan. */
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.open(VERSION).then(c => c.match(e.request).then(hit => {
      const net = fetch(e.request).then(res => { c.put(e.request, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
    return;
  }
  if (url.origin !== location.origin) return;
  /* Réseau d'abord (contenu toujours à jour), cache en secours (hors ligne). */
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./index.html")))
  );
});
