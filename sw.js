const CACHE_NAME = '7toros-cache-v1';
const assets = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cachedResponse => cachedResponse || fetch(e.request).catch(() => caches.match('./index.html'))));
});
