const CACHE_NAME = "ver-7"
const self = this;

self.addEventListener('install', (e) => {
    e.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            console.log('[Service Worker] Opened cache');
            const files = performance.getEntriesByType('resource').map(r => {
                const name = r.name;
                const domenName = r.name.split('/')
                    .slice(0, 3)
                    .join('/');
                return name.replace(domenName, '');
            }).filter(f => !['/', '/manifest.json'].includes(f));
            await cache.addAll(files);
        })()
    );
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        (async () => {
            const r = await caches.match(event.request);
            console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
            if (r) return r;
            const response = await fetch(event.request);
            const cache = await caches.open(CACHE_NAME);
            console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
            await cache.put(event.request, response.clone());
            return response;
        })()
    );
})

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName))
                {
                    console.log('[Service Worker] delete other cache: ' + cacheName)
                    return caches.delete(cacheName);
                }
            })
        ))
    )
})
