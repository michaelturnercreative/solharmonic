var SHELL_CACHE="solharmonic-member-shell-v1";
var SHELL=[
  "./","./index.html","./persistent.css","./persistent.js",
  "../assets/css/tokens.css","../assets/css/base.css","../assets/css/components.css","../assets/css/player.css",
  "../assets/js/icons.js","../assets/js/artwork.js","../assets/js/data.js","../assets/js/tracks.js","../assets/js/theme.js",
  "../assets/img/favicon.svg"
];

self.addEventListener("install",function(event){
  event.waitUntil(caches.open(SHELL_CACHE).then(function(cache){return cache.addAll(SHELL);}).then(function(){return self.skipWaiting();}));
});

self.addEventListener("activate",function(event){
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch",function(event){
  if(event.request.method!=="GET")return;
  event.respondWith(caches.match(event.request).then(function(cached){
    if(cached)return cached;
    return fetch(event.request);
  }));
});
