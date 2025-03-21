const CACHE_NAME = "offline-cache-v1";
const OFFLINE_FILES = [
    "index.html",
    "style.css",
    "script.js",
    "icon.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching offline files...");
            return cache.addAll(OFFLINE_FILES);
        }).catch(error => console.error("Cache Error:", error))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // If fetch is successful, return the response
                return response;
            })
            .catch(() => {
                // If offline, return cache or fallback to index.html
                return caches.match(event.request)
                    .then((response) => {
                        return response || caches.match("index.html");
                    })
                    .catch(() => {
                        console.error("Service Worker Fetch Failed:", event.request.url);
                    });
            })
    );
});





