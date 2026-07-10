var C = 'tsplit-v18';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k !== C; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  if(req.mode === 'navigate' || req.destination === 'document'){
    e.respondWith(fetch(req).then(function(r){
      var cp = r.clone(); caches.open(C).then(function(c){ c.put(req, cp); }); return r;
    }).catch(function(){ return caches.match(req); }));
  } else if(req.url.indexOf('gstatic.com') >= 0){
    e.respondWith(caches.match(req).then(function(m){
      return m || fetch(req).then(function(r){
        var cp = r.clone(); caches.open(C).then(function(c){ c.put(req, cp); }); return r;
      });
    }));
  }
});
