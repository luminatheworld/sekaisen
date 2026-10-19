// 세계선 커리어 · 오프라인 캐시
const C = 'sekaisen-v99';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './crests.json'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(C).then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('message', (e) => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin === self.location.origin) {
    if (r.mode === 'navigate') { e.respondWith(fetch(new Request(r.url, { cache: 'no-store', credentials: 'same-origin' })).then((res) => { const cp = res.clone(); caches.open(C).then((c) => c.put('./index.html', cp)); return res; }).catch(() => caches.match('./index.html'))); return; }
    e.respondWith(caches.match(r).then((m) => m || fetch(r)));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(u.host)) {
    e.respondWith(caches.open(C).then((c) => c.match(r).then((m) => m || fetch(r).then((res) => { c.put(r, res.clone()); return res; }))));
  }
});
