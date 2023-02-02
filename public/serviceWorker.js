const CACHE_NAME = "ver-1"
const urlsToCache = ['index.html']

const self = this;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');

                return cache.addAll(urlsToCache);
            })
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request)
                    .catch((err) => console.log('No internet.', err));
            })
    )
})

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName))
                    return caches.delete(cacheName);
            })
        ))
    )
})
