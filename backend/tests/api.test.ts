import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { openDatabase } from '../src/db.js';
import { buildApp } from '../src/app.js';
const origin = 'http://localhost:3000';
const password = 'demo-passphrase-2026';
const progressState = { starsCount: 3, unlockedLevels: { logic_game: 2 }, unlockedBadges: ['explorer'], worldVisits: { build: 1, explore: 0, create: 0, help: 0, organize: 0, count: 0 }, telemetryLog: [] };
async function setup(url = ':memory:', extra = {}) {
  const db = await openDatabase(url);
  const app = await buildApp({ db, origin, rateLimits: false, ...extra });
  const send = (method: string, path: string, payload?: unknown, auth?: { cookie: string; csrfToken: string }) => app.inject({ method: method as 'GET', url: `/api${path}`, payload, headers: { origin, ...(auth ? { cookie: auth.cookie, 'x-csrf-token': auth.csrfToken } : {}) } });
  async function account(username: string) {
    assert.equal((await send('POST', '/auth/register', { username, password })).statusCode, 201);
    const response = await send('POST', '/auth/login', { username, password });
    assert.equal(response.statusCode, 200);
    const cookie = String(response.headers['set-cookie']).split(';')[0]!;
    return { cookie, csrfToken: response.json().csrfToken };
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

test('origin, CSRF, malformed input, credential hashes and cookie flags', async () => {
  const t = await setup();
  try {
    const auth = await t.account('teacher-test');
    assert.equal((await t.send('POST', '/auth/register', { username: 'teacher-test', password })).statusCode, 409);
    assert.equal((await t.send('POST', '/auth/login', { username: 'teacher-test', password: 'incorrect-password' })).statusCode, 401);
    assert.equal((await t.send('POST', '/auth/login', { username: 'unknown-test', password: 'incorrect-password' })).statusCode, 401);
    assert.equal((await t.send('POST', '/students', { nameOrAlias: 'X', avatar: '🦊', owner_id: 'forged' }, auth)).statusCode, 400);
    const blocked = await t.app.inject({ method: 'POST', url: '/api/students', headers: { origin: 'https://evil.example', cookie: auth.cookie, 'x-csrf-token': auth.csrfToken }, payload: { nameOrAlias: 'Fox', avatar: '🦊' } });
    assert.equal(blocked.statusCode, 403);
    assert.equal((await t.send('POST', '/auth/logout', {}, { ...auth, csrfToken: 'x'.repeat(64) })).statusCode, 403);
    assert.equal((await t.send('POST', '/auth/logout', {}, { ...auth, csrfToken: 'é'.repeat(64) })).statusCode, 403);
    const dbAccount = (await t.db.execute('SELECT password_hash FROM accounts')).rows[0]!;
    assert.notEqual(dbAccount.password_hash, password);
    const session = (await t.db.execute('SELECT token_hash FROM sessions')).rows[0]!;
    assert.notEqual(session.token_hash, auth.cookie.split('=')[1]);
    const login = await t.send('POST', '/auth/login', { username: 'teacher-test', password }, auth);
    assert.match(String(login.headers['set-cookie']), /HttpOnly/);
    assert.match(String(login.headers['set-cookie']), /SameSite=Lax/i);
    assert.equal(login.headers['cache-control'], 'no-store');
    assert.equal((await t.send('GET', '/auth/me', undefined, auth)).statusCode, 401); // rotation
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

test('authentication is rate limited and production cookies are secure', async () => {
  const t = await setup(':memory:', { rateLimits: true, production: true, origin: 'https://demo.example' });
  try {
    const send = (path: string, payload: unknown) => t.app.inject({ method: 'POST', url: '/api' + path, headers: { origin: 'https://demo.example' }, payload });
    assert.equal((await send('/auth/register', { username: 'cookie-test', password })).statusCode, 201);
    const login = await send('/auth/login', { username: 'cookie-test', password });
    assert.match(String(login.headers['set-cookie']), /__Host-talento=/);
    assert.match(String(login.headers['set-cookie']), /Secure/);
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
