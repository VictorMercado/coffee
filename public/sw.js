const CACHE_NAME = "orbit-coffee-v6";
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

  // Regex for static assets
  const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(request.url);

  // 1. For HTML/Navigation/API/Auth -> Network Only (never cache)
  // Also skip non-http requests (e.g. chrome-extension://)
  if (!isStaticAsset || request.method !== "GET" || request.url.includes("/api/") || !request.url.startsWith("http")) {
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
