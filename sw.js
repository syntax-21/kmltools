const CACHE_NAME = 'kmltools-workspace-v3';
const CORE_ASSETS = [
  './',
  './index.html',
  './converter.html',
  './bulkrename.html',
  './tiangnew.html',
  './asesoristiang.html',
  './splitline.html',
  './ukurallpro.html',
  './styles/kmltools-pro.css',
  './scripts/app-shell.js',
  './scripts/tool-embed.js',
  './kml.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
