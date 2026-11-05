import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveApiBaseUrl } from '../src/utils/apiConfig';
import { readCredential, writeCredential } from '../src/utils/session';
import { api, ApiError, apiBaseUrl, setSessionCredential } from '../src/utils/api';

const token = 'a'.repeat(64);
const credential = () => ({ token, expiresAt: Date.now() + 60_000 });
class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}
const key = `talento_sf_session_v2:${apiBaseUrl}`;

async function browser(run: (storage: MemoryStorage, events: EventTarget) => Promise<void>) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalFetch = globalThis.fetch;
  const storage = new MemoryStorage(), events = new EventTarget();
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    sessionStorage: storage, dispatchEvent: (event: Event) => events.dispatchEvent(event),
  } });
  try { await run(storage, events); }
  finally {
    globalThis.fetch = originalFetch;
    if (descriptor) Object.defineProperty(globalThis, 'window', descriptor);
    else Reflect.deleteProperty(globalThis, 'window');
  }
}

test('API URL is canonical, configurable and rejects credentials or mixed-content deployments', () => {
  assert.equal(resolveApiBaseUrl(), 'http://localhost:3001/api');
  for (const value of ['https://api.example', 'https://api.example/', 'https://api.example/api', ' https://api.example/api/ ']) {
    assert.equal(resolveApiBaseUrl(value), 'https://api.example/api');
  }
  assert.equal(resolveApiBaseUrl('https://api.example/api', 'http://localhost:3000'), 'https://api.example/api');
  for (const value of ['', '/api', 'not a URL', 'ftp://api.example', 'https://user:secret@api.example', 'https://api.example/api?token=x', 'https://api.example/#x', 'https://api.example/api/api']) {
    assert.throws(() => resolveApiBaseUrl(value), Error, value);
  }
  assert.throws(() => resolveApiBaseUrl('http://api.example/api', 'https://frontend.example'), /HTTPS/);
});

test('session storage validates expiry and persists only token/expiry under its API-specific key', () => {
  const storage = new MemoryStorage();
  assert.equal(readCredential(storage, key), null);
  for (const value of ['{broken', 'null', '[]', '{}', JSON.stringify({token,expiresAt:0}), JSON.stringify({token,expiresAt:Date.now()-1}), JSON.stringify({token:'short',expiresAt:Date.now()+60_000})]) {
    storage.setItem(key,value);
    assert.equal(readCredential(storage,key),null);
    assert.equal(storage.getItem(key),null);
  }
  const value = credential();
  writeCredential(storage,key,{...value,password:'must-not-persist',student:{nameOrAlias:'Demo'}} as typeof value);
  assert.deepEqual(JSON.parse(storage.getItem(key)!),value);
  assert.deepEqual(readCredential(storage,key),value);
  assert.equal(readCredential(storage,key+':other-api'),null);
  assert.equal(readCredential(storage,key,value.expiresAt),null);
  assert.throws(()=>writeCredential(storage,key,{token:'bad',expiresAt:Date.now()+60_000}));
  writeCredential(storage,key,value);writeCredential(storage,key,null);
  assert.equal(storage.getItem(key),null);
});

test('API client sends Bearer directly to the configured API and omits ambient cookies', async () => browser(async () => {
  setSessionCredential(credential());
  let calls = 0;
  globalThis.fetch = async (url, init) => {
    calls++;
    assert.equal(url,apiBaseUrl+'/students');
    assert.equal(init?.credentials,'omit');
    assert.equal(init?.cache,'no-store');
    assert.equal((init?.headers as Record<string,string>).Authorization,'Bearer '+token);
    assert.equal((init?.headers as Record<string,string>)['X-CSRF-Token'],undefined);
    assert.equal((init?.headers as Record<string,string>)['Content-Type'],'application/json');
    assert.deepEqual(JSON.parse(init?.body as string),{nameOrAlias:'Demo'});
    return Response.json({ok:true});
  };
  assert.deepEqual(await api('/students','POST',{nameOrAlias:'Demo'}),{ok:true});
  for(const path of ['https://evil.example','//evil.example','/../other','/auth/me?token=x','/auth/me#x'])await assert.rejects(api(path));
  assert.equal(calls,1);
}));

test('network, malformed replies, conflicts and wrong passwords retain the credential', async () => browser(async storage => {
  setSessionCredential(credential());
  for(const response of [() => {throw new TypeError('network');},()=>new Response('<html>loading</html>'),()=>Response.json({error:'VERSION_CONFLICT'},{status:409}),()=>Response.json({error:'INVALID_CREDENTIALS'},{status:401})]) {
    globalThis.fetch = async () => response();
    await assert.rejects(api('/mode/professional','POST',{password:'wrong'}),ApiError);
    assert.equal(readCredential(storage,key)?.token,token);
  }
}));

test('an expired or revoked server session clears the token and notifies the app', async () => browser(async (storage,events) => {
  setSessionCredential(credential());
  let invalidations=0;events.addEventListener('session-invalid',()=>invalidations++);
  globalThis.fetch = async () => Response.json({error:'LOGIN_REQUIRED'},{status:401});
  await assert.rejects(api('/students'),(error:ApiError)=>error.code==='LOGIN_REQUIRED');
  assert.equal(storage.getItem(key),null);assert.equal(invalidations,1);
  setSessionCredential(credential());
  await assert.rejects(api('/auth/me'),ApiError);
  assert.equal(storage.getItem(key),null);assert.equal(invalidations,1);
}));

test('late unauthorized responses cannot erase a newer login', async () => browser(async (storage,events) => {
  setSessionCredential(credential());
  let invalidations=0;events.addEventListener('session-invalid',()=>invalidations++);
  let resolve!: (response:Response)=>void;
  globalThis.fetch = () => new Promise<Response>(done=>{resolve=done;});
  const request=api('/students');
  const next={token:'b'.repeat(64),expiresAt:Date.now()+60_000};
  setSessionCredential(next);
  resolve(Response.json({error:'LOGIN_REQUIRED'},{status:401}));
  await assert.rejects(request,ApiError);
  assert.deepEqual(readCredential(storage,key),next);assert.equal(invalidations,0);
}));

test('expiry during an in-flight request still retires the loaded UI session', async () => browser(async (storage,events) => {
  setSessionCredential(credential());
  let invalidations=0;events.addEventListener('session-invalid',()=>invalidations++);
  let resolve!: (response:Response)=>void;
  globalThis.fetch = () => new Promise<Response>(done=>{resolve=done;});
  const request=api('/students');
  storage.setItem(key,JSON.stringify({token,expiresAt:Date.now()-1}));
  resolve(Response.json({error:'LOGIN_REQUIRED'},{status:401}));
  await assert.rejects(request,ApiError);
  assert.equal(storage.getItem(key),null);assert.equal(invalidations,1);
}));

test('a server child lock refreshes the UI without discarding authentication', async () => browser(async (storage,events) => {
  setSessionCredential(credential());
  let invalidations=0;events.addEventListener('session-invalid',()=>invalidations++);
  globalThis.fetch = async () => Response.json({error:'PROFESSIONAL_REQUIRED'},{status:403});
  await assert.rejects(api('/students'),ApiError);
  assert.equal(readCredential(storage,key)?.token,token);assert.equal(invalidations,1);
}));
