import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// The connected demo never caches accounts or API responses. Retire this app's
// old offline worker before rendering a session, without touching other apps.
async function start() {
 if ('serviceWorker' in navigator) {
  const scope = new URL(import.meta.env.BASE_URL, location.origin).href;
  const registrations = await navigator.serviceWorker.getRegistrations();
  const hadWorker = registrations.some(r => r.scope === scope);
  await Promise.all(registrations.filter(r=>r.scope===scope).map(r=>r.unregister()));
  if ('caches' in window) await caches.delete('talento-sf-v1');
  if (hadWorker && navigator.serviceWorker.controller) { location.reload(); return; }
 }
 createRoot(document.getElementById('root')!).render(<App />);
}
void start();
