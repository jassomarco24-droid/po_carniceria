const CACHE_NAME = '7toros-cache-v85';
const ASSETS = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// 1. Fase de Instalacion: Almacena archivos estaticos esenciales y fuerza activacion inmediata
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Corta de golpe la sala de espera del navegador
});

// 2. Fase de Activacion: Purga y elimina de forma absoluta cualquier cache viejo en el almacenamiento interno
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key); // Destruye versiones de cache obsoletas
        }
      })
    ))
  );
  self.clients.claim(); // Toma el control total de la pestaña del cliente inmediatamente
});

// 3. Estrategia de Red: Intenta obtener datos de internet en primer lugar, si falla, sirve del búnker offline
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
