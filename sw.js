// sw.js - This script must reside at the root of the directory to function properly
const CACHE_STORAGE_NAME = 'lab-8-cache';

// Install the service worker and pre-cache the specified resources
self.addEventListener('install', (event) => {
  const preCacheUrls = [
    'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
  ];

  event.waitUntil(
    caches.open(CACHE_STORAGE_NAME).then((cache) => {
      // Cache the predefined URLs during the `installation
      return cache.addAll(preCacheUrls);
    })
  );
});

// Activate the service worker and take control of the client
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Intercept network requests and serve them from the cache if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_STORAGE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // Return cached response if available, otherwise fetch from the network
        return cachedResponse || fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
