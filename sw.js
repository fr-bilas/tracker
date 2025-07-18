const CACHE_NAME = 'reading-tracker-v2';
const urlsToCache = [
  './index.html',
  './app.js',
  './manifest.json'
  // CSS ফাইল থাকলে এখানে যোগ করো
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event (পুরনো cache ডিলিট)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event (cache first strategy)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Background Sync
self.addEventListener('sync', event => {
  if (event.tag === 'background-timer') {
    event.waitUntil(doBackgroundTimer());
  }
});

function doBackgroundTimer() {
  return self.registration.showNotification('Reading Tracker', {
    body: 'Timer is running in background',
    icon: './icon-192.png', // এখানে তোমার icon ফাইলের সঠিক path দাও
    badge: './icon-192.png',
    silent: true
  });
}
