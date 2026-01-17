// Service Worker for CodeAssist AI
// This service worker handles common requests and caches static assets

const CACHE_NAME = 'codeassist-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/signup.html',
  '/login.html',
  '/dashboard.html'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version if available, otherwise fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Handle push notifications (optional)
self.addEventListener('push', function(event) {
  console.log('Received a push notification', event);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Focus or open the app when notification is clicked
  event.waitUntil(
    clients.openWindow('/')
  );
});