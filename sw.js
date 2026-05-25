const CACHE_NAME = '7toros-cache-v2'; // Cambiamos a v2 para avisar al chip del celular
const assets = ['./', './index.html'];

// Al instalar, guardamos los archivos nuevos y forzamos el apagado del viejo sistema
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
  self.skipWaiting(); // Obliga a la app nueva a tomar el control de inmediato
});

// Este bloque busca carpetas de memoria viejas (v1) y las destruye de forma automática
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Borra el caché viejo en el celular del cliente
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request).catch(() => caches.match('./index.html'));
    })
  );
});
