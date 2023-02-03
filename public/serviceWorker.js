const CACHE_NAME = "ver-1"
const urlsToCache = ['index.html']

const self = this;
let defferedPrompt;

window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    console.log(event)
    defferedPrompt = event
});

document.body.addEventListener('click', event => {
    defferedPrompt.prompt();

    defferedPrompt.userChoice.then(choice => {
        if(choice.outcome === 'accepted'){
            console.log('user accepted the prompt')
        }
        defferedPrompt = null;
    })
})

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
