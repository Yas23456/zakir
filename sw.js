/* ذاكِر service worker — offline app shell. © د. ياسر نضال رحّال
   - navigation / index.html: network-first (always fresh after a deploy), cached copy when offline
   - same-origin static assets + CDN libraries/fonts: stale-while-revalidate
   - everything else (Gemini API, uploads, images search…) is NOT touched */
const V = 'zakir-shell-v6';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './icon.svg'];
const CDN = /^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//;
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('zakir-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); const same = u.origin === self.location.origin;
  if (r.mode === 'navigate' && same) {
    e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put('./index.html', cp)); } return res; })
      .catch(() => caches.match('./index.html').then(m => m || caches.match('./')).then(m => m || new Response('<meta charset="utf-8"><p dir="rtl" style="font-family:sans-serif;padding:2rem">ذاكِر يحتاج اتصال أول مرة.</p>', {headers: {'Content-Type': 'text/html; charset=utf-8'}}))));
    return;
  }
  if ((same && !u.pathname.endsWith('sw.js')) || CDN.test(r.url)) {
    e.respondWith(caches.open(V).then(c => c.match(r).then(hit => {
      // an opaque (no-cors) copy must never answer a CORS request (fonts/CSS with crossorigin) — that fails the load
      const ok = hit && !(hit.type === 'opaque' && r.mode !== 'no-cors') ? hit : null;
      const net = fetch(r).then(res => { if (res && (res.ok || (res.type === 'opaque' && r.mode === 'no-cors'))) c.put(r, res.clone()).catch(() => {}); return res; }).catch(() => ok || Response.error());
      return ok || net;
    })));
  }
});
self.addEventListener('notificationclick', e => { e.notification.close(); e.waitUntil(self.clients.matchAll({type: 'window'}).then(cs => cs.length ? cs[0].focus() : self.clients.openWindow('./'))); });
