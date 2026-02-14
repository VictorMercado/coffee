const CACHE_NAME = "orbit-coffee-v7";
const STATIC_ASSETS = [
  "/icon-light-32x32.png",
  "/icon-dark-32x32.png",
  "/apple-icon.png",
  "/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, non-http, API calls
  if (request.method !== "GET" || !request.url.startsWith("http") || request.url.includes("/api/")) {
    return;
  }

  // Skip Next.js RSC data requests (these carry dynamic page data)
  if (url.searchParams.has("_rsc") || request.headers.get("RSC") || request.headers.get("Next-Router-State-Tree")) {
    return;
  }

  // Skip Next.js data routes
  if (url.pathname.startsWith("/_next/data/")) {
    return;
  }

  // Only cache static assets (images, fonts, etc.)
  const isStaticAsset = /\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(request.url);

  if (!isStaticAsset) {
    return;
  }

  // 2. For Static Assets -> Stale-While-Revalidate (or Network First)
  // Let's stick to Network First for safety, but allow cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache only valid responses
        if (response.ok && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch((err) => {
        // If network fails, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          // If neither network nor cache works, throw error (or return offline page)
          throw err;
        });
      })
  );
});
