/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const CACHE_NAME = "van-assets-v1";
const OFFLINE_ASSETS = [
  "./",
  "./index.html",
  "./src/main.tsx",
  "./src/index.css"
];

// Install service worker and pre-cache essential resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("VAN PWA: Pre-caching offline elements");
      return cache.addAll(OFFLINE_ASSETS);
    })
  );
});

// Cache interceptor and network-fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Return offline page if offline
        return caches.match("./index.html");
      });
    })
  );
});

// Activates rules and flushes older caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("VAN PWA: Flush stale cache index", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
