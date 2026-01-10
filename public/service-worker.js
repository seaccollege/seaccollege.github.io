const CACHE_NAME = 'seac-college-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/404',
  '/500',
  'html/error/404.html',
  'html/error/500.html',
  'css/error/error-style.css',
  'html/error/favicon.ico',
  '/css/all.min.css',
  '/images/favicon/favicon.ico',
  '/images/icon/icon-512x512.png',
  '/images/icon/icon-192x192.png',
  '/images/icon/icon-72x72.png',
  '/images/favicon/favicon-32x32.png',
  '/images/favicon/favicon-16x16.png',
  '/images/logo.png',

];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseClone = response.clone();
        
        // Cache the fetched response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        
        return response;
      })
      .catch(() => {
        // If fetch fails, try to get from cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          
          // Handle navigation requests (HTML pages)
          if (event.request.mode === 'navigate') {
            // Try to return 404 page from cache
            return caches.match('/404.html').then((response404) => {
              return response404 || new Response('Page not found', {
                status: 404,
                statusText: 'Not Found',
                headers: new Headers({
                  'Content-Type': 'text/html'
                })
              });
            });
          }
          
          // For other failed requests
          return new Response('Network error', {
            status: 408,
            statusText: 'Request Timeout'
          });
        });
      })
  );
});

// Handle errors globally
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

// Background Sync (for future use)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implement background sync logic here
  console.log('Background sync triggered');
}

// Push Notifications (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from South Eastern Arabic College',
    icon: 'icon-192x192.png',
    badge: 'icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('South Eastern Arabic College', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
