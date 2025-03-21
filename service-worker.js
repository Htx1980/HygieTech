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
            return cache.addAll(OFFLINE_FILES);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request) || caches.match("index.html");
        })
    );
});
