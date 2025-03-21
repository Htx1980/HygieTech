const CACHE_NAME = "offline-cache-v1";
const OFFLINE_FILES = [
    "./index.html",
    "./style.css",
    "./script.js",
    "./icon.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching offline files...");
            return cache.addAll(OFFLINE_FILES);
        }).catch(error => console.log("Cache Error:", error))
    );
    self.skipWaiting(); 
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Deleting old cache:", cache);
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
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                console.log("Offline: Serving fallback page");
                return caches.match("./index.html"); 
            });
        })
    );
});



