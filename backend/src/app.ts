import Fastify, { type FastifyRequest } from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import staticFiles from '@fastify/static';
import type { Client, Row } from '@libsql/client';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { resolve } from 'node:path';
import { ZodError } from 'zod';
import { credentials, passwordInput, newStudent, progress, review, enterChild, type Profile } from './schemas.js';
import { digest, token, hashPassword, verifyPassword } from './security.js';

interface Options { db: Client; origin: string; production?: boolean; staticDir?: string; rateLimits?: boolean; sessionTtlMs?: number }
interface Session { token_hash: string; account_id: string; csrf_token: string; mode: 'professional' | 'child'; student_id: string | null; expires_at: number }
class ApiError extends Error { constructor(public statusCode: number, public code: string) { super(code); } }
export async function buildApp(options: Options) {
  const { db, origin, production = false } = options;
  if (new URL(origin).origin !== origin || (production && !origin.startsWith('https://'))) throw new Error('APP_ORIGIN debe ser un origen exacto; HTTPS en producción');
  const app = Fastify({ logger: false, trustProxy: (_address, hop) => production && hop === 0, bodyLimit: 256 * 1024 });
  const cookieName = production ? '__Host-talento' : 'talento';
  const cookieOptions = { path: '/', httpOnly: true, secure: production, sameSite: 'lax' as const };
  const ttl = options.sessionTtlMs ?? 8 * 3600_000;
  await app.register(cookie);
  await app.register(cors, { origin, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'X-CSRF-Token'] });
  await app.register(rateLimit, { global: true, max: options.rateLimits === false ? 100_000 : 300, timeWindow: '1 minute' });
  app.addHook('onRequest', async (request, reply) => {
    if (!request.url.startsWith('/api/')) return;
    reply.header('Cache-Control', 'no-store');
    reply.header('X-Content-Type-Options', 'nosniff');
    // Same-origin production, or the one explicit development origin. No wildcards.
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && request.headers.origin !== origin) throw new ApiError(403, 'ORIGIN_NOT_ALLOWED');
  });
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) return reply.code(400).send({ error: 'INVALID_INPUT', fields: error.issues.map(i => i.path.join('.')) });
    if (error instanceof ApiError) return reply.code(error.statusCode).send({ error: error.code });
    const status = (error as { statusCode?: number }).statusCode;
    return reply.code(status && status < 500 ? status : 500).send({ error: status === 429 ? 'RATE_LIMITED' : status && status < 500 ? 'BAD_REQUEST' : 'INTERNAL_ERROR' });
  });
  const query = (sql: string, args: (string | number | null)[] = []) => db.execute({ sql, args });
  async function session(request: FastifyRequest, professional = false): Promise<Session> {
    const raw = request.cookies[cookieName];
    if (!raw || !/^[a-f0-9]{64}$/.test(raw)) throw new ApiError(401, 'LOGIN_REQUIRED');
    const result = await query('SELECT * FROM sessions WHERE token_hash=? AND expires_at>?', [digest(raw), Date.now()]);
    const row = result.rows[0] as unknown as Session | undefined;
    if (!row) throw new ApiError(401, 'LOGIN_REQUIRED');
    if (!['GET', 'HEAD'].includes(request.method)) {
      const value = request.headers['x-csrf-token'];
      if (typeof value !== 'string' || !/^[a-f0-9]{64}$/.test(value) || !timingSafeEqual(Buffer.from(value), Buffer.from(row.csrf_token))) throw new ApiError(403, 'CSRF_REQUIRED');
    }
    if (professional && row.mode !== 'professional') throw new ApiError(403, 'PROFESSIONAL_REQUIRED');
    return row;
  }
  async function studentRow(id: string, s: Session) {
    if (s.mode === 'child' && s.student_id !== id) throw new ApiError(404, 'STUDENT_NOT_FOUND');
    const result = await query('SELECT * FROM students WHERE id=? AND owner_id=?', [id, s.account_id]);
    if (!result.rows[0]) throw new ApiError(404, 'STUDENT_NOT_FOUND');
    return result.rows[0];
  }
  function studentView(row: Row, s: Session) {
    const profile = JSON.parse(String(row.profile)) as Profile;
    if (s.mode === 'child') profile.teacherValidation = { reviewed: false, agreements: {}, teacherNotes: '' };
    return { student: profile, version: Number(row.version), updatedAt: row.updated_at };
  }
  async function save(row: Row, profile: Profile, version: number) {
    const result = await query('UPDATE students SET profile=?,version=version+1,updated_at=? WHERE id=? AND version=?', [JSON.stringify(profile), new Date().toISOString(), String(row.id), version]);
    if (!result.rowsAffected) throw new ApiError(409, 'VERSION_CONFLICT');
    return { version: version + 1 };
  }
  const authLimit = { rateLimit: { max: options.rateLimits === false ? 100_000 : 10, timeWindow: '1 minute' } };
  // Equal-cost verification for unknown users avoids an immediate timing shortcut.
  const dummyHash = await hashPassword(token());
  app.get('/api/health', async () => { await query('SELECT 1'); return { ok: true }; });
  app.post('/api/auth/register', { config: authLimit }, async (request, reply) => {
    const input = credentials.parse(request.body);
    const passwordHash = await hashPassword(input.password);
    try {
      await query('INSERT INTO accounts(id,username,password_hash,created_at) VALUES(?,?,?,?)', [randomUUID(), input.username, passwordHash, new Date().toISOString()]);
    } catch (error) {
      if (String((error as { code?: string }).code).startsWith('SQLITE_CONSTRAINT')) throw new ApiError(409, 'USERNAME_UNAVAILABLE');
      throw error;
    }
    return reply.code(201).send({ registered: true });
  });
  app.post('/api/auth/login', { config: authLimit }, async (request, reply) => {
    const input = credentials.parse(request.body);
    const result = await query('SELECT * FROM accounts WHERE username=?', [input.username]);
    const account = result.rows[0];
    const valid = await verifyPassword(input.password, account ? String(account.password_hash) : dummyHash);
    if (!valid || !account) throw new ApiError(401, 'INVALID_CREDENTIALS');
    const raw = token(); const csrfToken = token(); const expires = Date.now() + ttl;
    const previous = request.cookies[cookieName];
    await db.batch([
      { sql: 'DELETE FROM sessions WHERE expires_at<=? OR token_hash=?', args: [Date.now(), digest(previous ?? '')] },
      { sql: 'INSERT INTO sessions(token_hash,account_id,csrf_token,mode,expires_at) VALUES(?,?,?,?,?)', args: [digest(raw), String(account.id), csrfToken, 'professional', expires] },
    ], 'write');
    reply.setCookie(cookieName, raw, { ...cookieOptions, maxAge: Math.floor(ttl / 1000) });
    return { account: { id: account.id, username: account.username }, mode: 'professional', studentId: null, csrfToken };
  });
  app.get('/api/auth/me', async request => {
    const s = await session(request);
    const result = await query('SELECT id,username FROM accounts WHERE id=?', [s.account_id]);
    return { account: result.rows[0], mode: s.mode, studentId: s.student_id, csrfToken: s.csrf_token };
  });
  app.post('/api/auth/logout', async (request, reply) => {
    const s = await session(request);
    await query('DELETE FROM sessions WHERE token_hash=?', [s.token_hash]);
    reply.clearCookie(cookieName, cookieOptions);
    return { loggedOut: true };
  });
  app.get('/api/students', async request => {
    const s = await session(request, true);
    const rows = await query('SELECT * FROM students WHERE owner_id=? ORDER BY updated_at DESC', [s.account_id]);
    return { students: rows.rows.map(row => studentView(row, s)) };
  });
  app.post('/api/students', async (request, reply) => {
    const s = await session(request, true);
    const input = newStudent.parse(request.body);
    const id = randomUUID(); const now = new Date().toISOString();
    // A bounded demo avoids unbounded list responses and accidental account growth.
    const profile: Profile = { ...input, id, createdAt: now, starsCount: 0, unlockedLevels: {}, unlockedBadges: [], worldVisits: { build: 0, explore: 0, create: 0, help: 0, organize: 0, count: 0 }, telemetryLog: [], teacherValidation: { reviewed: false, agreements: {}, teacherNotes: '' } };
    const inserted = await query('INSERT INTO students(id,owner_id,profile,updated_at) SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM students WHERE owner_id=?)<50', [id, s.account_id, JSON.stringify(profile), now, s.account_id]);
    if (!inserted.rowsAffected) throw new ApiError(409, 'STUDENT_LIMIT');
    return reply.code(201).send({ student: profile, version: 0, updatedAt: now });
  });
  app.get<{ Params: { id: string } }>('/api/students/:id', async request => {
    const s = await session(request);
    return studentView(await studentRow(request.params.id, s), s);
  });
  app.put<{ Params: { id: string } }>('/api/students/:id', async request => {
    const s = await session(request, true);
    const input = newStudent.extend({version: progress.shape.version}).parse(request.body);
    const row = await studentRow(request.params.id,s);
    const profile = JSON.parse(String(row.profile)) as Profile;
    const {version,...metadata} = input;
    return save(row,{...profile,...metadata},version);
  });
  app.put<{ Params: { id: string } }>('/api/students/:id/progress', async request => {
    const s = await session(request);
    const input = progress.parse(request.body);
    const row = await studentRow(request.params.id, s);
    const profile = JSON.parse(String(row.profile)) as Profile;
    const { version, ...state } = input;
    // Notes and professional validation are never accepted through this route.
    const next = { ...profile, ...state };
    next.teacherValidation = { reviewed: false, agreements: profile.teacherValidation.agreements, teacherNotes: profile.teacherValidation.teacherNotes };
    return save(row, next, version);
  });
  app.put<{ Params: { id: string } }>('/api/students/:id/review', async request => {
    const s = await session(request, true);
    const input = review.parse(request.body);
    const row = await studentRow(request.params.id, s);
    const profile = JSON.parse(String(row.profile)) as Profile;
    profile.teacherValidation = { reviewed: true, validatedAt: new Date().toISOString(), agreements: input.agreements, teacherNotes: input.teacherNotes };
    return save(row, profile, input.version);
  });
  app.delete<{ Params: { id: string } }>('/api/students/:id', async request => {
    const s = await session(request, true);
    await studentRow(request.params.id, s);
    await db.batch([
      { sql: 'DELETE FROM sessions WHERE student_id=?', args: [request.params.id] },
      { sql: 'DELETE FROM students WHERE id=? AND owner_id=?', args: [request.params.id, s.account_id] },
    ], 'write');
    return { deleted: true };
  });
  app.post('/api/mode/child', async request => {
    const s = await session(request, true);
    const { studentId } = enterChild.parse(request.body);
    await studentRow(studentId, s);
    await query("UPDATE sessions SET mode='child',student_id=? WHERE token_hash=?", [studentId, s.token_hash]);
    return { mode: 'child', studentId };
  });
  app.post('/api/mode/professional', { config: authLimit }, async request => {
    const s = await session(request);
    const { password } = passwordInput.parse(request.body);
    const account = (await query('SELECT password_hash FROM accounts WHERE id=?', [s.account_id])).rows[0]!;
    if (!await verifyPassword(password, String(account.password_hash))) throw new ApiError(401, 'INVALID_CREDENTIALS');
    await query("UPDATE sessions SET mode='professional',student_id=NULL WHERE token_hash=?", [s.token_hash]);
    return { mode: 'professional', studentId: null };
  });
  if (options.staticDir) {
    await app.register(staticFiles, { root: resolve(options.staticDir) });
    app.setNotFoundHandler((request, reply) => {
      if (request.url.startsWith('/api/')) return reply.code(404).send({ error: 'NOT_FOUND' });
      if (request.method === 'GET' && request.headers.accept?.includes('text/html')) return reply.sendFile('index.html');
      return reply.code(404).send({ error: 'NOT_FOUND' });
    });
  }
  return app;
}
