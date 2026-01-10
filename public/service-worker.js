const CACHE_PREFIX = 'seac-college';
const CACHE_VERSION = 'v1';
const PRECACHE = `${CACHE_PREFIX}-precache-${CACHE_VERSION}`;
const RUNTIME = `${CACHE_PREFIX}-runtime-${CACHE_VERSION}`;

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/404',
  '/500',
  '/html/error/404.html',
  '/html/error/500.html',
  '/css/error/error-style.css',
  '/html/error/favicon.ico',
  '/css/all.min.css',
  '/images/favicon/favicon.ico',
  '/images/icon/icon-512x512.png',
  '/images/icon/icon-192x192.png',
  '/images/icon/icon-72x72.png',
  '/images/favicon/favicon-32x32.png',
  '/images/favicon/favicon-16x16.png',
  '/images/logo.png',
  '/images/background.jpg',
  'http://seaccollege.github.io/images/favicon/favicon.ico',
];

// Install Service Worker (resilient caching)
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    // Fetch each resource individually and only store successful responses.
    await Promise.allSettled(urlsToCache.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'no-cache' });
        if (!response || !response.ok) throw new Error('Network response not ok for ' + url);
        await cache.put(url, response.clone());
      } catch (err) {
        console.warn('Service Worker: Failed to cache', url, err);
      }
    }));
    await self.skipWaiting();
  })());
});

// Activate Service Worker: keep current version, remove only old seac caches
async function broadcastMessage(message) {
  try {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach((client) => {
      try { client.postMessage(message); } catch (e) { /* ignore */ }
    });
  } catch (err) {
    console.warn('Service Worker: broadcastMessage failed', err);
  }
}

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    const deleted = [];
    await Promise.all(cacheNames.map((name) => {
      if (name.startsWith(CACHE_PREFIX) && name !== PRECACHE && name !== RUNTIME) {
        deleted.push(name);
        console.log('Service Worker: Removing old cache', name);
        return caches.delete(name);
      }
      return Promise.resolve();
    }));
    // If we removed older caches, notify clients a new version is available
    if (deleted.length) {
      await broadcastMessage({ type: 'NEW_VERSION_AVAILABLE' });
    }
    await self.clients.claim();
  })());
});

// Fetch Event
const MAX_RUNTIME_ENTRIES = 50;

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    for (let i = 0; i < keys.length - maxItems; i++) {
      await cache.delete(keys[i]);
    }
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Network-first for navigation (HTML pages)
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(req);
        // Cache updated index.html
        const cache = await caches.open(PRECACHE);
        cache.put('/index.html', networkResponse.clone()).catch(() => {});
        return networkResponse;
      } catch (err) {
        const cached = await caches.match('/index.html');
        if (cached) return cached;
        const fallback = await caches.match('/html/error/404.html');
        return fallback || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } });
      }
    })());
    return;
  }

  // Cache-first for same-origin assets, with runtime caching for dynamic assets
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    try {
      const response = await fetch(req);
      // Only cache successful same-origin, non-opaque responses
      let isSameOrigin = false;
      try {
        isSameOrigin = new URL(req.url).origin === self.location.origin;
      } catch (e) {
        // If req.url is not a valid absolute URL in this context, treat as not same-origin
        isSameOrigin = false;
      }
      if (response && response.ok && isSameOrigin && (response.type === 'basic' || response.type === 'cors')) {
        const cache = await caches.open(RUNTIME);
        cache.put(req, response.clone()).catch(() => {});
        trimCache(RUNTIME, MAX_RUNTIME_ENTRIES).catch(() => {});
      }
      return response;
    } catch (err) {
      // If request is for an image, return a simple inline SVG placeholder
      if (req.destination === 'image') {
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#aaa" font-size="20">Image unavailable</text></svg>';
        return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
      }
      return new Response('Network error', { status: 408, statusText: 'Request Timeout' });
    }
  })());
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
  console.log('Background sync triggered');
}

// Push Notifications (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from South Eastern Arabic College',
    icon: '/images/icon/icon-192x192.png',
    badge: '/images/icon/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(self.registration.showNotification('South Eastern Arabic College', options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});

// Allow the page to tell the SW to skip waiting and activate immediately
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    event.waitUntil(self.skipWaiting());
  }
});
