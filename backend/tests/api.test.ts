import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { openDatabase } from '../src/db.js';
import { buildApp } from '../src/app.js';
import { readOrigins, validateOrigins } from '../src/config.js';
const origin = 'http://localhost:3000';
const password = 'demo-passphrase-2026';
const progressState = { starsCount: 3, unlockedLevels: { logic_game: 2 }, unlockedBadges: ['explorer'], worldVisits: { build: 1, explore: 0, create: 0, help: 0, organize: 0, count: 0 }, telemetryLog: [] };
async function setup(url = ':memory:', extra = {}) {
  const db = await openDatabase(url);
  const app = await buildApp({ db, origins: [origin], rateLimits: false, ...extra });
  const send = (method: string, path: string, payload?: unknown, auth?: { token: string }) => app.inject({ method: method as 'GET', url: `/api${path}`, payload, headers: { origin, ...(auth ? { authorization: `Bearer ${auth.token}` } : {}) } });
  async function account(username: string) {
    assert.equal((await send('POST', '/auth/register', { username, password })).statusCode, 201);
    const response = await send('POST', '/auth/login', { username, password });
    assert.equal(response.statusCode, 200);
    assert.equal(response.headers['set-cookie'], undefined);
    assert.match(response.json().token, /^[a-f0-9]{64}$/);
    return { token: response.json().token as string };
  }
  return { db, app, send, account, close: async () => { await app.close(); db.close(); } };
}

test('accounts are pseudonymous, isolated; child mode hides notes and requires the password to exit', async () => {
  const t = await setup();
  try {
    const a = await t.account('teacher-fox'); const b = await t.account('teacher-owl');
    const created = await t.send('POST', '/students', { nameOrAlias: 'Zorro Azul', avatar: '🦊' }, a);
    assert.equal(created.statusCode, 201);
    const id = created.json().student.id;
    assert.equal((await t.send('GET', `/students/${id}`, undefined, b)).statusCode, 404);
    assert.deepEqual((await t.send('GET', '/students', undefined, b)).json(), { students: [] });
    assert.equal((await t.send('PUT', `/students/${id}/progress`, { version: 0, ...progressState }, b)).statusCode, 404);
    assert.equal((await t.send('POST', '/mode/child', { studentId: id }, b)).statusCode, 404);
    assert.equal((await t.send('DELETE', `/students/${id}`, undefined, b)).statusCode, 404);
    assert.equal((await t.send('PUT', `/students/${id}/review`, { version: 0, agreements: { str_logic: true }, teacherNotes: 'Observación educativa de ejemplo.' }, a)).statusCode, 200);
    const second = (await t.send('POST', '/students', { nameOrAlias: 'Lince Verde', avatar: '🐾' }, a)).json().student.id;
    assert.equal((await t.send('POST', '/mode/child', { studentId: id }, a)).statusCode, 200);
    assert.equal((await t.send('GET', '/auth/me', undefined, a)).json().mode, 'child');
    assert.equal((await t.send('GET', '/students', undefined, a)).statusCode, 403);
    const child = (await t.send('GET', `/students/${id}`, undefined, a)).json();
    assert.equal(child.student.teacherValidation.teacherNotes, '');
    assert.equal((await t.send('GET', `/students/${second}`, undefined, a)).statusCode, 404);
    assert.equal((await t.send('POST', '/students', { nameOrAlias: 'X', avatar: '🐾' }, a)).statusCode, 403);
    assert.equal((await t.send('POST', '/mode/child', { studentId: second }, a)).statusCode, 403);
    assert.equal((await t.send('PUT', `/students/${id}/review`, { version: 1, agreements: {}, teacherNotes: '' }, a)).statusCode, 403);
    assert.equal((await t.send('POST', '/mode/professional', { password: 'incorrecta' }, a)).statusCode, 401);
    assert.equal((await t.send('GET', '/auth/me', undefined, a)).json().mode, 'child');
    assert.equal((await t.send('PUT', `/students/${id}/progress`, { version: 1, ...progressState, teacherValidation: {} }, a)).statusCode, 400);
    assert.equal((await t.send('PUT', `/students/${id}/progress`, { version: 1, ...progressState }, a)).statusCode, 200);
    assert.equal((await t.send('PUT', `/students/${id}/progress`, { version: 1, ...progressState }, a)).statusCode, 409);
    assert.equal((await t.send('POST', '/mode/professional', { password }, a)).statusCode, 200);
    const restored = (await t.send('GET', `/students/${id}`, undefined, a)).json();
    assert.equal(restored.student.starsCount, 3);
    assert.equal(restored.student.teacherValidation.teacherNotes, 'Observación educativa de ejemplo.');
    assert.equal(restored.version, 2);
    assert.equal((await t.send('DELETE', `/students/${id}`, undefined, a)).statusCode, 200);
    assert.equal((await t.send('GET', `/students/${id}`, undefined, a)).statusCode, 404);
    assert.equal((await t.send('POST', '/auth/logout', {}, a)).statusCode, 200);
    assert.equal((await t.send('GET', '/auth/me', undefined, a)).statusCode, 401);
  } finally { await t.close(); }
});

test('Bearer-only authentication, origin checks, malformed input, hashes and session rotation', async () => {
  const t = await setup();
  try {
    const auth = await t.account('teacher-test');
    assert.equal((await t.send('POST', '/auth/register', { username: 'teacher-test', password })).statusCode, 409);
    assert.equal((await t.send('POST', '/auth/login', { username: 'teacher-test', password: 'incorrect-password' })).statusCode, 401);
    assert.equal((await t.send('POST', '/auth/login', { username: 'unknown-test', password: 'incorrect-password' })).statusCode, 401);
    assert.equal((await t.send('POST', '/students', { nameOrAlias: 'X', avatar: '🦊', owner_id: 'forged' }, auth)).statusCode, 400);
    const blocked = await t.app.inject({ method: 'POST', url: '/api/students', headers: { origin: 'https://evil.example', authorization: `Bearer ${auth.token}` }, payload: { nameOrAlias: 'Fox', avatar: '🦊' } });
    assert.equal(blocked.statusCode, 403);
    for (const authorization of ['Basic ' + auth.token, 'Bearer invalid', 'Bearer ' + 'é'.repeat(64), 'Bearer ' + auth.token + ', Bearer ' + auth.token]) {
      assert.equal((await t.app.inject({ url: '/api/auth/me', headers: { authorization } })).statusCode, 401);
    }
    assert.equal((await t.send('POST', '/auth/logout', {}, { token: '0'.repeat(64) })).statusCode, 401);
    // Neither old HttpOnly cookies nor URL parameters authorize any endpoint.
    const cookie = `talento=${auth.token}; __Host-talento=${auth.token}`;
    assert.equal((await t.app.inject({ url: '/api/auth/me', headers: { cookie } })).statusCode, 401);
    assert.equal((await t.app.inject({ method: 'POST', url: '/api/auth/logout', headers: { cookie }, payload: {} })).statusCode, 401);
    assert.equal((await t.app.inject({ url: '/api/auth/me?token=' + auth.token })).statusCode, 401);
    // Native/CLI clients can authenticate without a browser Origin header.
    assert.equal((await t.app.inject({ url: '/api/auth/me', headers: { authorization: `bearer ${auth.token}` } })).statusCode, 200);
    const dbAccount = (await t.db.execute('SELECT password_hash FROM accounts')).rows[0]!;
    assert.notEqual(dbAccount.password_hash, password);
    const session = (await t.db.execute('SELECT token_hash FROM sessions')).rows[0]!;
    assert.notEqual(session.token_hash, auth.token);
    const login = await t.send('POST', '/auth/login', { username: 'teacher-test', password }, auth);
    assert.equal(login.headers['set-cookie'], undefined);
    assert.notEqual(login.json().token, auth.token);
    assert.equal(login.json().csrfToken, undefined);
    assert.ok(login.json().expiresAt > Date.now());
    assert.ok(login.json().expiresAt <= Date.now() + 8 * 3600_000);
    assert.equal(login.headers['cache-control'], 'no-store');
    assert.equal((await t.send('GET', '/auth/me', undefined, auth)).statusCode, 401); // rotation
    const me = await t.send('GET', '/auth/me', undefined, { token: login.json().token });
    assert.equal(me.statusCode, 200);
    assert.equal(me.json().token, undefined); // only login returns a raw credential
    assert.equal(me.json().expiresAt, login.json().expiresAt);
  } finally { await t.close(); }
});

test('state and session survive reopening the database; expiry is enforced', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'talento-backend-'));
  const url = pathToFileURL(join(dir, 'test.db')).href;
  let t = await setup(url);
  try {
    const a = await t.account('persistent-test');
    const id = (await t.send('POST', '/students', { nameOrAlias: 'Zorro Azul', avatar: '🦊' }, a)).json().student.id;
    await t.send('PUT', `/students/${id}/progress`, { version: 0, ...progressState }, a);
    await t.close(); t = await setup(url);
    assert.equal((await t.send('GET', `/students/${id}`, undefined, a)).json().student.starsCount, 3);
    await t.db.execute('UPDATE sessions SET expires_at=0');
    assert.equal((await t.send('GET', '/auth/me', undefined, a)).statusCode, 401);
  } finally { await t.close(); await rm(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 }); }
});

test('authentication is rate limited and production returns no authentication cookies', async () => {
  const t = await setup(':memory:', { rateLimits: true, production: true, origins: ['https://demo.example'] });
  try {
    const send = (path: string, payload: unknown) => t.app.inject({ method: 'POST', url: '/api' + path, headers: { origin: 'https://demo.example' }, payload });
    assert.equal((await send('/auth/register', { username: 'cookie-test', password })).statusCode, 201);
    const login = await send('/auth/login', { username: 'cookie-test', password });
    assert.equal(login.headers['set-cookie'], undefined);
    assert.match(login.json().token, /^[a-f0-9]{64}$/);
    for (let i = 0; i < 9; i++) await send('/auth/login', { username: 'unknown-test', password });
    assert.equal((await send('/auth/login', { username: 'unknown-test', password })).statusCode, 429);
  } finally { await t.close(); }
});

// A real static response checks the deployment path, not just API injection.
test('same-origin static hosting serves the SPA but never an API fallback', async () => {
  const { writeFile } = await import('node:fs/promises');
  const dir = await mkdtemp(join(tmpdir(), 'talento-static-'));
  await writeFile(join(dir, 'index.html'), '<!doctype html><title>Demo</title>');
  const t = await setup(':memory:', { staticDir: dir });
  try {
    assert.equal((await t.app.inject({ url: '/' })).statusCode, 200);
    const spa = await t.app.inject({ url: '/play', headers: { accept: 'text/html' } });
    assert.equal(spa.statusCode, 200);
    assert.match(spa.body, /<title>Demo/);
    const unknown = await t.app.inject({ url: '/api/unknown', headers: { accept: 'text/html' } });
    assert.equal(unknown.statusCode, 404);
    assert.equal(unknown.json().error, 'NOT_FOUND');
  } finally { await t.close(); await rm(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 }); }
});


test('metadata CRUD is professional-only, versioned and isolated',async()=>{
 const t=await setup();
 try {
  const a=await t.account('metadata-test');const b=await t.account('metadata-other');
  const id=(await t.send('POST','/students',{nameOrAlias:'Zorro Azul',avatar:'🦊'},a)).json().student.id;
  const input={nameOrAlias:'Lince Verde',avatar:'🐾',preferredLanguage:'en',age:10,version:0};
  assert.equal((await t.send('PUT','/students/'+id,input,b)).statusCode,404);
  assert.equal((await t.send('PUT','/students/'+id,input,a)).statusCode,200);
  assert.equal((await t.send('GET','/students/'+id,undefined,a)).json().student.nameOrAlias,'Lince Verde');
  assert.equal((await t.send('PUT','/students/'+id,input,a)).statusCode,409);
  await t.send('POST','/mode/child',{studentId:id},a);
  assert.equal((await t.send('PUT','/students/'+id,{...input,version:1},a)).statusCode,403);
 } finally {await t.close();}
});

test('CORS allows exact configured origins and Authorization preflights without cookies', async () => {
  const origins = [origin, 'https://frontend.example'];
  const t = await setup(':memory:', { origins, production: true });
  try {
    const auth = await t.account('cors-demo');
    for (const allowed of origins) {
      const preflight = await t.app.inject({ method: 'OPTIONS', url: '/api/students', headers: {
        origin: allowed, 'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type,authorization',
      } });
      assert.equal(preflight.statusCode, 204);
      assert.equal(preflight.headers['access-control-allow-origin'], allowed);
      assert.equal(preflight.headers['access-control-allow-credentials'], undefined);
      assert.match(String(preflight.headers['access-control-allow-headers']), /Authorization/i);
      assert.match(String(preflight.headers.vary), /Origin/i);
      const response = await t.app.inject({ url: '/api/students', headers: { origin: allowed, authorization: `Bearer ${auth.token}` } });
      assert.equal(response.statusCode, 200);
      assert.equal(response.headers['access-control-allow-origin'], allowed);
      assert.equal(response.headers['cache-control'], 'no-store');
    }
    for (const denied of ['null', 'https://evil.example', 'https://frontend.example.evil.test', 'https://frontend.example:444', 'http://localhost:3002']) {
      for (const method of ['OPTIONS', 'GET', 'POST'] as const) {
        const response = await t.app.inject({ method, url: '/api/students', headers: { origin: denied, authorization: `Bearer ${auth.token}`, 'access-control-request-method': 'POST' }, ...(method === 'POST' ? { payload: {nameOrAlias:'Demo',avatar:'🦊'} } : {}) });
        assert.equal(response.statusCode, 403, `${method} ${denied}`);
        assert.equal(response.json().error, 'ORIGIN_NOT_ALLOWED');
        assert.equal(response.headers['access-control-allow-origin'], undefined);
      }
    }
  } finally { await t.close(); }
});

test('origin configuration is explicit; production permits HTTPS and HTTP loopback only', () => {
  assert.deepEqual(readOrigins({}), [origin]);
  assert.deepEqual(readOrigins({ NODE_ENV:'production', ALLOWED_ORIGINS: `${origin}, https://demo.example,${origin}` }), [origin,'https://demo.example']);
  assert.deepEqual(readOrigins({ APP_ORIGIN:origin }), [origin]); // existing local .env
  assert.deepEqual(readOrigins({ ALLOWED_ORIGINS:'https://new.example', APP_ORIGIN:origin }), ['https://new.example']);
  assert.throws(() => readOrigins({ NODE_ENV:'production' }), /ALLOWED_ORIGINS/);
  for (const value of ['*', '', 'null', 'https://*.netlify.app', 'https://demo.example/', 'https://demo.example/path', 'https://user:secret@demo.example', 'ftp://demo.example', 'http://demo.example']) {
    assert.throws(() => validateOrigins([value], true), Error, value);
  }
  assert.throws(() => validateOrigins([]), /ALLOWED_ORIGINS/);
});

test('logging out revokes a shared token; independent sessions remain valid', async () => {
  const t = await setup();
  try {
    const a = await t.account('independent-demo');
    const b = (await t.send('POST','/auth/login',{username:'independent-demo',password})).json();
    assert.equal((await t.send('POST','/auth/logout',{},a)).statusCode,200);
    assert.equal((await t.send('GET','/auth/me',undefined,a)).statusCode,401);
    assert.equal((await t.send('GET','/auth/me',undefined,{token:b.token})).statusCode,200);
  } finally { await t.close(); }
});
