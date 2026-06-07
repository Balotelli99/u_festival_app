const CACHE_NAME = 'v2-u-festival';
const ASSETS = ['index.html', 'style.css', 'app.js'];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Forceer direct overnemen
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Verwijder oude caches zodat je telefoon de nieuwe bestanden ophaalt
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Network-first strategie: haal eerst van internet (nieuwste versie), als je offline bent pak de cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Update the cache automatically if the fetch is successful
        if (e.request.method === 'GET') {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});