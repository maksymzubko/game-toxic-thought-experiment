const CACHE_NAME = "ver-10.2"
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
            return r || requestBackend(event);
            // const response = await fetch(event.request);
            // const cache = await caches.open(CACHE_NAME);
            //
            // await cache.put(event.request, response.clone());
            // return response;
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

function requestBackend(event){
    console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
    var url = event.request.clone();
    return fetch(url).then(function(res){
        //if not a valid response send the error
        if(!res || res.status !== 200 || res.type !== 'basic'){
            return res;
        }

        var response = res.clone();

        caches.open(CACHE_NAME).then(function(cache){
            cache.put(event.request, response);
        });

        return res;
    })
}
