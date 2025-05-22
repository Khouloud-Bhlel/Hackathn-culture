const CACHE_NAME = 'museum-cache-v2';
const STATIC_CACHE_NAME = 'museum-static-v2';
const DYNAMIC_CACHE_NAME = 'museum-dynamic-v2';

// Injection point for the Workbox precache manifest
// This will be replaced by the Vite PWA plugin during build
self.__WB_MANIFEST = self.__WB_MANIFEST || [];

// URLs to cache statically (core app shell)
const staticUrlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo.svg',
  '/logo192.png',
  '/logo512.png'
];

// Assets to cache on install (more app resources)
const assetsToCache = [
  '/assets/index-*.js',
  '/assets/index-*.css',
  '/images/*.jpeg'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  // Skip waiting so the new service worker activates immediately
  self.skipWaiting();

  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Caching static app shell');
        return cache.addAll(staticUrlsToCache);
      }),
      // Cache additional assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching app assets');
        // Use a different approach for the wildcard patterns
        return cache.addAll(
          assetsToCache.filter(url => !url.includes('*'))
        );
      })
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
  
  // Claim clients so the SW is in control immediately
  event.waitUntil(self.clients.claim());
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => {
      console.log('Service Worker activated and controlling');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network with dynamic caching
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // For navigation requests (HTML documents), use network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If we got a valid response, clone it and put in cache
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache, then fallback to offline page
          return caches.match(event.request)
            .then(cacheResponse => {
              return cacheResponse || caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // For image requests, use cache-first strategy
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(response => {
              // If we got a valid response, cache it
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              const responseToCache = response.clone();
              caches.open(DYNAMIC_CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            })
            .catch(() => {
              // If both cache and network fail for images, return a fallback
              if (event.request.url.includes('.jpeg') || 
                  event.request.url.includes('.jpg') || 
                  event.request.url.includes('.png')) {
                return new Response(
                  '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">' +
                  '<rect width="400" height="300" fill="#FBDB93" />' +
                  '<text x="50%" y="50%" font-family="Arial" font-size="24" fill="#641B2E" text-anchor="middle">الصورة غير متوفرة</text>' +
                  '</svg>',
                  { headers: { 'Content-Type': 'image/svg+xml' } }
                );
              }
              return new Response('Resource not available offline');
            });
        })
    );
    return;
  }

  // For other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            // Return the response if it's not valid or not from our origin
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cache assets and script files
            if (event.request.url.includes('/assets/') || 
                event.request.url.endsWith('.js') || 
                event.request.url.endsWith('.css')) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // For API fallbacks or other resources
            console.log('Network request failed for:', event.request.url);
            return new Response('Network error occurred', { status: 408 });
          });
      })
  );
});

// Fetch event - handle navigation requests to keep in the PWA
self.addEventListener('fetch', (event) => {
  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If offline, return the offline page
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // For non-navigation requests, use a cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        // Try to fetch the resource
        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();

            // Open the dynamic cache and add the fetched resource
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If the request is for an image, return a fallback image
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/images/fallback-image.svg');
            }
            
            // Otherwise, just return whatever we have in cache or the offline page
            return caches.match('/offline.html');
          });
      })
  );
});
