const CACHE_NAME = 'reading-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  'https://kit.fontawesome.com/a076d05399.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Handle background sync for timer
self.addEventListener('sync', event => {
  if (event.tag === 'background-timer') {
    event.waitUntil(doBackgroundTimer());
  }
});

function doBackgroundTimer() {
  // Keep timer running in background
  return self.registration.showNotification('Reading Tracker', {
    body: 'Timer is running in background',
    icon: '/manifest.json',
    badge: '/manifest.json',
    silent: true
  });
}