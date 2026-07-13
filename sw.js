// MedLearn Service Worker - offline support
const CACHE_NAME = 'medlearn-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './features.css',
  './cinematic.css',
  './medications.js',
  './app.js',
  './features.js',
  './admin.html',
  './manifest.json',
  './icon.svg'
];

// Install - cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Fetch - serve from cache, fall back to network (cache-first)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          try { cache.put(event.request, response.clone()); } catch(e) {}
          return response;
        });
      }).catch(() => cached);
    })
  );
});
