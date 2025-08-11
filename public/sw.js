const CACHE_NAME = 'riskratio-v1.0.1'
const urlsToCache = [
  // Cache only static assets; avoid caching HTML pages to prevent stale UI
  '/manifest.json',
]

// Install event - cache resources safely
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        try {
          await Promise.all(
            urlsToCache.map(async (url) => {
              const res = await fetch(url, { method: 'GET' })
              if (res && res.ok) await cache.put(url, res)
            })
          )
        } catch (err) {
          console.warn('SW install cache warn:', err)
        }
      })
  )
})

// Strategy helpers
async function networkFirst(request) {
  try {
    const fresh = await fetch(request)
    if (fresh && fresh.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, fresh.clone())
    }
    return fresh
  } catch (_) {
    const cached = await caches.match(request)
    return cached || Response.error()
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  const res = await fetch(request)
  if (res && res.ok && request.method === 'GET') {
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, res.clone())
  }
  return res
}

// Fetch event - network-first for HTML/navigation; cache-first for static
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const accept = event.request.headers.get('accept') || ''
  const isHTML = event.request.mode === 'navigate' || accept.includes('text/html')

  if (isHTML) {
    event.respondWith(networkFirst(event.request))
  } else {
    event.respondWith(cacheFirst(event.request))
  }
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New trading alert!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now(), primaryKey: 1 },
    actions: [
      { action: 'explore', title: 'View Details', icon: '/icon-192x192.png' },
      { action: 'close', title: 'Close', icon: '/icon-192x192.png' },
    ],
  }
  event.waitUntil(self.registration.showNotification('RiskRat.io', options))
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/dashboard'))
  }
})

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(Promise.resolve())
  }
})
