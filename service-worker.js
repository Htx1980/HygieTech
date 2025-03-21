const CACHE_NAME = "offline-cache-v1";
const OFFLINE_FILES = [
    "/HygieTech/", // Root page (GitHub Pages)
    "/HygieTech/index.html",
    "/HygieTech/style.css",
    "/HygieTech/script.js",
    "/HygieTech/icon.png"
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
                return response;
            })
            .catch(() => {
                return caches.match(event.request)
                    .then((response) => response || caches.match("/HygieTech/index.html"));
            })
    );
});





