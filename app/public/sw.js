// Retirement worker for previously installed offline versions. No fetch handler.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
 event.waitUntil((async () => {
  await caches.delete('talento-sf-v1');
  await self.registration.unregister();
  const clients = await self.clients.matchAll({ type: 'window' });
  for (const client of clients) await client.navigate(client.url);
 })());
});
