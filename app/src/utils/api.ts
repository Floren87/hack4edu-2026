import { resolveApiBaseUrl } from './apiConfig';
import { readCredential, writeCredential, type SessionCredential } from './session';

export class ApiError extends Error {
 constructor(public code: string, public status = 0) { super(code); }
}
export const apiBaseUrl = resolveApiBaseUrl(import.meta.env?.VITE_API_BASE_URL, typeof window === 'undefined' ? undefined : window.location.origin);
const storageKey = `talento_sf_session_v2:${apiBaseUrl}`;
const getToken = () => readCredential(window.sessionStorage, storageKey)?.token;
export const setSessionCredential = (value: SessionCredential | null) => writeCredential(window.sessionStorage, storageKey, value);
export async function api<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
 if (!/^\/(?!\/)/.test(path) || path.includes('?') || path.includes('#') || /(?:^|\/)\.\.?(?:\/|$)/.test(path)) throw new Error('API paths must be relative to the configured API');
 const token = getToken();
 let response: Response;
 try {
  response = await fetch(`${apiBaseUrl}${path}`, { method, credentials: 'omit', cache: 'no-store',
   headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
   body: body === undefined ? undefined : JSON.stringify(body) });
 } catch { throw new ApiError('NETWORK'); }
 let data: any;
 try { data = await response.json(); } catch { throw new ApiError('NETWORK'); }
 if (!response.ok) {
  const code = data.error ?? 'NETWORK';
  const invalid = response.status === 401 && code === 'LOGIN_REQUIRED';
  // An old request must not discard a newer login completed in the meantime.
  const currentToken = getToken();
  if (!currentToken || token === currentToken) {
   if (invalid) setSessionCredential(null);
   if (path !== '/auth/me' && (invalid || code === 'PROFESSIONAL_REQUIRED')) window.dispatchEvent(new Event('session-invalid'));
  }
  throw new ApiError(code, response.status);
 }
 return data;
}
