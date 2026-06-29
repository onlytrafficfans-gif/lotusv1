/**
 * Lotus App Builder Service Worker
 * Handles PWA installation, caching, and offline support
 * Supports: Chrome, Firefox, Safari, Edge, Brave, Opera
 */

const CACHE_NAME = "lotus-app-v2";
const OFFLINE_URL = "/";
const RUNTIME_CACHE = "lotus-runtime-v2";

// Files to cache on install
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/favicon-32x32.png",
  "/icons/favicon-192x192.png",
  "/icons/favicon-512x512.png",
];

// Install event - cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS).catch((err) => {
          console.warn("Precache failed, some files may not be available offline:", err);
          // Continue even if some files fail
          return Promise.resolve();
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip API calls (let them go through network normally)
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === "error") {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache successful responses
            caches
              .open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((err) => {
                console.warn("Failed to cache response:", err);
              });

            return response;
          })
          .catch((err) => {
            // Network request failed, return offline fallback
            console.warn("Fetch failed, returning offline fallback:", err);
            return caches.match(OFFLINE_URL);
          });
      })
      .catch((err) => {
        console.warn("Cache match failed:", err);
        return caches.match(OFFLINE_URL);
      })
  );
});

// Handle messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
