export class ApiError extends Error {
 constructor(public code: string, public status = 0) { super(code); }
}
let csrfToken = '';
export const setCsrfToken = (value: string) => { csrfToken = value; };
export async function api<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
 let response: Response;
 try {
  response = await fetch(`/api${path}`, { method, credentials: 'include', cache: 'no-store',
   headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(method !== 'GET' ? { 'X-CSRF-Token': csrfToken } : {}) },
   body: body === undefined ? undefined : JSON.stringify(body) });
 } catch { throw new ApiError('NETWORK'); }
 let data: any;
 try { data = await response.json(); } catch { throw new ApiError('NETWORK'); }
 if (!response.ok) {
  const code = data.error ?? 'NETWORK';
  if (path !== '/auth/me' && ((response.status === 401 && code === 'LOGIN_REQUIRED') || code === 'PROFESSIONAL_REQUIRED')) window.dispatchEvent(new Event('session-invalid'));
  throw new ApiError(code, response.status);
 }
 return data;
}
