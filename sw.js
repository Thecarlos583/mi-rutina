// Service worker: guarda la app completa para que funcione sin internet en el gym.
// Al cambiar cualquier archivo, sube VERSION para que el teléfono descargue lo nuevo.
const VERSION = 'mi-rutina-v20';
const ARCHIVOS = [
  './', './index.html', './manifest.json', './css/styles.css',
  './js/app.js', './js/data.js', './js/store.js', './js/calendario.js', './js/util.js',
  './js/rutina.js', './js/cuerpo.js', './js/timer.js', './js/hoy.js', './js/sabado.js',
  './js/progreso.js', './js/guia.js', './js/ajustes.js', './js/anim.js', './js/poses.js', './js/agarres.js', './js/calc.js', './js/pasos.js', './js/pasos-datos.js', './js/semana.js', './js/registro.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  // cache: 'reload' baja cada archivo del servidor, no de la memoria del navegador (si no, la versión nueva podía quedar con archivos viejos)
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

// Ajustes pregunta qué versión está guardada
self.addEventListener('message', e => { if (e.data === 'version') e.source?.postMessage({ version: VERSION }); });

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
      const red = fetch(e.request, { cache: 'no-cache' }).then(r => {
        if (r.ok) cache.put(e.request, r.clone());
        return r;
      }).catch(() => null);
      return guardado || (await red) || (e.request.mode === 'navigate' ? cache.match('./index.html') : Response.error());
    })
  );
});
