/** One public URL for development, previews and production. Never contains a secret. */
export const DEFAULT_API_BASE_URL = 'https://hack4edu-2026.onrender.com/api';

export function resolveApiBaseUrl(configured?: string, frontendOrigin?: string): string {
  const value = configured === undefined ? DEFAULT_API_BASE_URL : configured.trim();
  let url: URL;
  try { url = new URL(value); } catch { throw new Error('VITE_API_BASE_URL debe ser una URL absoluta HTTP(S) de la API'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('VITE_API_BASE_URL no admite credenciales, query ni fragmento');
  }
  const pathname = url.pathname.replace(/\/+$/, '');
  if (pathname && pathname !== '/api') throw new Error('VITE_API_BASE_URL debe terminar en /api o ser el origen de la API');
  if (frontendOrigin?.startsWith('https:') && url.protocol !== 'https:') {
    throw new Error('Un frontend HTTPS requiere VITE_API_BASE_URL HTTPS');
  }
  return `${url.origin}/api`;
}
