// Service worker: guarda la app completa para que funcione sin internet en el gym.
// Al cambiar cualquier archivo, sube VERSION para que el teléfono descargue lo nuevo.
const VERSION = 'mi-rutina-v4';
const ARCHIVOS = [
  './', './index.html', './manifest.json', './css/styles.css',
  './js/app.js', './js/data.js', './js/store.js', './js/calendario.js', './js/util.js',
  './js/rutina.js', './js/cuerpo.js', './js/timer.js', './js/hoy.js', './js/sabado.js',
  './js/progreso.js', './js/guia.js', './js/ajustes.js', './js/anim.js', './js/poses.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Primero la caché (rápido y sin internet); si hay red, se actualiza en segundo plano
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(VERSION).then(async cache => {
      const guardado = await cache.match(e.request, { ignoreSearch: true });
      const red = fetch(e.request).then(r => {
        if (r.ok) cache.put(e.request, r.clone());
        return r;
      }).catch(() => null);
      return guardado || (await red) || (e.request.mode === 'navigate' ? cache.match('./index.html') : Response.error());
    })
  );
});
