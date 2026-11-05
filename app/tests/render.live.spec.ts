import { test, expect, type Page } from '@playwright/test';
import { randomBytes } from 'node:crypto';
import fs from 'node:fs/promises';
import { DEFAULT_API_BASE_URL as api } from '../src/utils/apiConfig';
import { ui } from '../src/i18n/account';
import { localizeText as text } from '../src/i18n/localize';

const origin = 'http://localhost:3000';
const sessionKey = `talento_sf_session_v2:${api}`;
async function register(page: Page, username: string, password: string) {
  await page.goto('/');
  await page.getByRole('group').getByRole('button', { name: 'English', exact: true }).click();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await page.getByLabel('Made-up username').fill(username);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'My students', exact: true })).toBeVisible();
}
async function authHeaders(page: Page) {
  const stored = await page.evaluate(key => sessionStorage.getItem(key), sessionKey);
  const credential = stored ? JSON.parse(stored) : null;
  expect(Boolean(credential?.token?.match(/^[a-f0-9]{64}$/))).toBe(true);
  return { Origin: origin, Authorization: `Bearer ${credential.token}` };
}

test('Render/libSQL: real browser CRUD, child lock, persistence, Arabic exports and isolation', async ({ page, browser }, testInfo) => {
  test.setTimeout(240_000);
  const runId = `${Date.now()}-${randomBytes(2).toString('hex')}`;
  const username = `qa-api-${runId}`;
  const password = randomBytes(24).toString('base64url');
  const otherUsername = `qa-b-${runId}`;
  const otherPassword = randomBytes(24).toString('base64url');
  const alias = 'QA Remote Fox';
  const editedAlias = 'QA Remote Lynx';
  const note = 'Observación educativa ficticia para validación remota.';
  let studentId: string | undefined;
  let otherToken: string | undefined;
  const errors: string[] = [];
  const apiHosts = new Set<string>();
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (request.url().includes('/api/')) apiHosts.add(new URL(request.url()).origin);
  });
  const secondContext = await browser.newContext();
  try {
    const health = await page.request.get(`${api}/health`, { headers: { Origin: origin } });
    expect(health.status()).toBe(200);
    expect(await health.json()).toEqual({ ok: true });
    expect(health.headers()['access-control-allow-origin']).toBe(origin);
    expect(health.headers()['cache-control']).toBe('no-store');
    const preflight = await page.request.fetch(`${api}/students`, { method: 'OPTIONS', headers: {
      Origin: origin, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'authorization,content-type',
    } });
    expect(preflight.status()).toBe(204);
    expect(preflight.headers()['access-control-allow-origin']).toBe(origin);

    await register(page, username, password);
    await page.getByRole('button', { name: 'Add student', exact: true }).click();
    await page.getByLabel('Pseudonym (never a real name)').fill(alias);
    const created = page.waitForResponse(response => response.url() === `${api}/students` && response.request().method() === 'POST');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    const createdResponse = await created;
    expect(createdResponse.status()).toBe(201);
    studentId = (await createdResponse.json()).student.id;
    await expect(page.getByRole('heading', { name: alias, exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    await page.getByLabel('Pseudonym (never a real name)').fill(editedAlias);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByRole('heading', { name: editedAlias, exact: true })).toBeVisible();
    await page.getByRole('article').getByRole('button', { name: 'Results', exact: true }).click();
    await page.getByPlaceholder('Add educator qualitative observations...').fill(note);
    await page.getByRole('button', { name: 'Save and Confirm Review', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Review Saved!', exact: true })).toBeVisible();
    await page.getByRole('navigation').getByRole('button', { name: 'My students', exact: true }).click();
    await page.getByRole('button', { name: 'Start playing', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Back to Teacher Profile', exact: true })).toBeVisible();
    for (const name of ['My students', 'Results', 'Family summary']) await expect(page.getByRole('button', { name, exact: true })).toHaveCount(0);
    const headers = await authHeaders(page);
    const forbiddenList = await page.request.get(`${api}/students`, { headers });
    expect(forbiddenList.status()).toBe(403);
    const child = await page.request.get(`${api}/students/${studentId}`, { headers });
    expect(child.status()).toBe(200);
    expect((await child.json()).student.teacherValidation.teacherNotes).toBe('');
    await page.getByRole('button', { name: /What Do You Invent/ }).filter({ hasText: 'Play now' }).click();
    await page.getByRole('button', { name: /Flying or space vehicle/ }).click();
    await page.getByRole('button', { name: 'Save my invention', exact: true }).click();
    const badge = page.getByRole('button', { name: "Great! Let's keep playing!", exact: true });
    if (await badge.isVisible()) await badge.click();
    await expect(page.getByRole('status')).toContainText('Saved');
    await page.reload();
    await expect(page.getByRole('button', { name: 'Back to Teacher Profile', exact: true })).toBeVisible();
    const persistedChild = (await (await page.request.get(`${api}/students/${studentId}`, { headers })).json()).student;
    expect(persistedChild.starsCount).toBe(3);
    expect(persistedChild.telemetryLog).toHaveLength(1);
    await page.getByRole('button', { name: 'Back to Teacher Profile', exact: true }).click();
    await page.getByLabel('Password', { exact: true }).fill('wrong-demo-password');
    await page.getByRole('dialog').getByRole('button', { name: 'Back to Teacher Profile', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('Incorrect username or password');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('dialog').getByRole('button', { name: 'Back to Teacher Profile', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'My students', exact: true })).toBeVisible();
    await page.getByRole('article').getByRole('button', { name: 'Results', exact: true }).click();
    await expect(page.getByPlaceholder('Add educator qualitative observations...')).toHaveValue(note);
    await expect(page.getByRole('heading', { name: 'What Do You Invent?', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Language: English', exact: true }).click();
    await page.getByRole('menuitemradio', { name: /العربية/ }).click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    for (const family of [false, true]) {
      if (family) await page.getByRole('navigation').getByRole('button', { name: ui('ar').family, exact: true }).click();
      const pending = page.waitForEvent('download');
      await page.getByTitle(text('ar', family ? 'Descargar resumen formateado' : 'Descargar documento oficial formateado para imprimir'), { exact: true }).click();
      const download = await pending;
      const html = await fs.readFile((await download.path())!, 'utf8');
      expect(html).toContain('<html lang="ar" dir="rtl">');
      expect(html).toContain(editedAlias);
      expect(html).toContain(text('ar', family ? 'Resumen para la familia' : 'Informe profesional'));
      if (family) expect(html).not.toContain(note);
      await page.screenshot({ path: testInfo.outputPath(family ? 'remote-family-ar.png' : 'remote-results-ar.png') });
    }

    const second = await secondContext.newPage();
    await register(second, otherUsername, otherPassword);
    await expect(second.getByText('No students yet. Create your first student to begin.', { exact: true })).toBeVisible();
    await expect(second.getByText(editedAlias, { exact: true })).toHaveCount(0);
    const otherHeaders = await authHeaders(second);
    otherToken = otherHeaders.Authorization;
    expect((await second.request.get(`${api}/students/${studentId}`, { headers: otherHeaders })).status()).toBe(404);
    await second.getByRole('button', { name: 'Sign out', exact: true }).click();
    otherToken = undefined;

    await page.getByRole('button', { name: ui('ar').logout, exact: true }).click();
    await expect(page.getByRole('heading', { name: ui('ar').login, exact: true })).toBeVisible();
    await page.getByRole('group').getByRole('button', { name: 'English', exact: true }).click();
    await page.getByLabel('Made-up username').fill(username);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.getByRole('heading', { name: editedAlias, exact: true })).toBeVisible();
    const restored = await page.request.get(`${api}/students/${studentId}`, { headers: await authHeaders(page) });
    expect(restored.status()).toBe(200);
    const student = (await restored.json()).student;
    expect(student.starsCount).toBe(3);
    expect(student.telemetryLog).toHaveLength(1);
    expect(student.teacherValidation.teacherNotes).toBe(note);
    expect(apiHosts).toEqual(new Set(['https://hack4edu-2026.onrender.com']));
    expect((await page.context().cookies()).some(cookie => ['talento', '__Host-talento'].includes(cookie.name))).toBe(false);
    expect(errors).toEqual([]);
  } finally {
    // Delete only the student created by this run, even if a UI assertion fails.
    // The API intentionally has no account-delete endpoint; empty qa-* accounts remain.
    if (studentId) {
      const login = await page.request.post(`${api}/auth/login`, { headers: { Origin: origin }, data: { username, password } });
      expect(login.status(), 'Cleanup login').toBe(200);
      const cleanup = { Origin: origin, Authorization: `Bearer ${(await login.json()).token}` };
      const removed = await page.request.delete(`${api}/students/${studentId}`, { headers: cleanup });
      expect([200, 404].includes(removed.status()), 'Cleanup own student').toBe(true);
      expect((await page.request.post(`${api}/auth/logout`, { headers: cleanup, data: {} })).status()).toBe(200);
    }
    const stored = await page.evaluate(key => sessionStorage.getItem(key), sessionKey).catch(() => null);
    if (stored) {
      await page.request.post(`${api}/auth/logout`, { headers: { Origin: origin, Authorization: `Bearer ${JSON.parse(stored).token}` }, data: {} });
      await page.evaluate(key => sessionStorage.removeItem(key), sessionKey);
    }
    if (otherToken) await page.request.post(`${api}/auth/logout`, { headers: { Origin: origin, Authorization: otherToken }, data: {} });
    await secondContext.close();
  }
});
