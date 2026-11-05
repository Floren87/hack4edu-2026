import { test, expect } from '@playwright/test';
import { ui } from '../src/i18n/account';
import { startChildSession, PASSWORD } from './session-helpers';

test('approved logo loads in login, privacy and installation assets', async ({ page }, testInfo) => {
  await page.goto('/');
  const logo = page.getByRole('img', { name: 'KoraMAP', exact: true });
  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute('src', /icon-192\.png$/);
  await expect.poll(() => logo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(192);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', './icon-192.png');
  const manifest = await (await page.request.get('/manifest.json')).json();
  for (const icon of manifest.icons) expect((await page.request.get(`/${icon.src}`)).status()).toBe(200);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.screenshot({ path: testInfo.outputPath('approved-logo-login-mobile.png'), fullPage: true });
  await page.goto('/privacidad.html');
  await expect(page.getByText(/requiere Internet y no tiene modo offline/)).toBeVisible();
  await expect(page.getByText(/no garantiza anonimización irreversible/)).toBeVisible();
  await expect(page.locator('.brand img')).toHaveAttribute('src', './icon-192.png');
  await expect.poll(() => page.locator('.brand img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(192);
});

test('loaded child mode cannot unlock the professional account without its online API', async ({ page, context }) => {
  const t = ui('es');
  await startChildSession(page);
  await expect(page.getByRole('button', { name: t.back, exact: true })).toBeVisible();
  await context.setOffline(true);
  try {
    await page.getByRole('button', { name: t.back, exact: true }).click();
    await page.getByLabel(t.password, { exact: true }).fill(PASSWORD);
    await page.getByRole('dialog').getByRole('button', { name: t.back, exact: true }).click();
    await expect(page.getByRole('alert')).toContainText(t.error);
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('group', { name: t.teacherProfile, exact: true })).toHaveCount(0);
  } finally { await context.setOffline(false); }
  await page.getByLabel(t.password, { exact: true }).fill(PASSWORD);
  await page.getByRole('dialog').getByRole('button', { name: t.back, exact: true }).click();
  await expect(page.getByRole('heading', { name: t.students, exact: true })).toBeVisible();
});
