import { test, expect, type Page } from '@playwright/test';
import { ui } from '../src/i18n/account';
import { LANGUAGES } from '../src/i18n/languages';
import type { Language } from '../src/types';

async function changeLanguage(page: Page, next: Language) {
  const current = await page.locator('html').getAttribute('lang') as Language;
  await page.getByRole('button', { name: `${ui(current).language}: ${LANGUAGES.find(item => item.id === current)!.name}`, exact: true }).click();
  await page.getByRole('menuitemradio', { name: LANGUAGES.find(item => item.id === next)!.name, exact: false }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', next);
}

test('teacher identity stays professional-only and the teacher profile return works in five languages', async ({ page }, testInfo) => {
  const username = `teacher-${Date.now()}-abcdefghij`; // Maximum 32 characters; never a real name.
  const password = 'Demo-teacher-profile-2026';
  await page.goto('/');
  await page.getByRole('group').getByRole('button', { name: 'English', exact: true }).click();
  await page.getByRole('button', { name: ui('en').register, exact: true }).click();
  await page.getByLabel(ui('en').username).fill(username);
  await page.getByLabel(ui('en').password, { exact: true }).fill(password);
  await page.getByRole('button', { name: ui('en').register, exact: true }).click();
  await expect(page.getByRole('heading', { name: ui('en').students, exact: true })).toBeVisible();

  for (const { id } of LANGUAGES) {
    await changeLanguage(page, id);
    const identity = page.getByRole('group', { name: ui(id).teacherProfile, exact: true });
    await expect(identity).toHaveCount(2); // Navbar and My students, including an empty account.
    for (let index = 0; index < 2; index++) await expect(identity.nth(index).locator('bdi')).toHaveText(username);
    await page.setViewportSize({ width: 360, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (let index = 0; index < 2; index++) {
      const name = identity.nth(index).locator('bdi');
      await expect(name).toBeVisible();
      expect((await name.boundingBox())!.width).toBeGreaterThan(60);
    }
    if (id === 'ar') await page.screenshot({ path: testInfo.outputPath('teacher-mobile-ar.png') });
    await page.setViewportSize({ width: 1366, height: 900 });
  }
  await page.reload();
  await expect(page.getByRole('group', { name: ui('uk').teacherProfile, exact: true })).toHaveCount(2);
  await changeLanguage(page, 'en');
  await page.getByRole('button', { name: ui('en').newStudent, exact: true }).click();
  await page.getByLabel(ui('en').alias).fill('Demo Fox');
  await page.getByRole('button', { name: ui('en').save, exact: true }).click();
  await page.getByRole('article').getByRole('button', { name: ui('en').results, exact: true }).click();
  await expect(page.getByRole('group', { name: ui('en').teacherProfile, exact: true })).toHaveCount(1);
  await page.getByRole('navigation').getByRole('button', { name: ui('en').students, exact: true }).click();
  await page.getByRole('button', { name: ui('en').play, exact: true }).click();

  for (const { id } of LANGUAGES) {
    await changeLanguage(page, id);
    const t = ui(id);
    await expect(page.getByRole('group', { name: t.teacherProfile, exact: true })).toHaveCount(0);
    await expect(page.getByText(username, { exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: t.back, exact: true }).click();
    await expect(page.getByRole('dialog').getByRole('heading', { name: t.back, exact: true })).toBeVisible();
    await expect(page.getByRole('dialog').getByText(t.unlock, { exact: true })).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: t.cancel, exact: true }).click();
  }
  await changeLanguage(page, 'es');
  await page.getByRole('button', { name: 'Volver al Perfil Docente', exact: true }).click();
  await page.getByLabel(ui('es').password, { exact: true }).fill(password);
  await page.getByRole('dialog').getByRole('button', { name: 'Volver al Perfil Docente', exact: true }).click();
  await expect(page.getByRole('group', { name: ui('es').teacherProfile, exact: true })).toHaveCount(2);
  await page.getByRole('button', { name: ui('es').logout, exact: true }).click();
  await expect(page.getByRole('heading', { name: ui('es').login, exact: true })).toBeVisible();
  await expect(page.getByRole('group', { name: ui('es').teacherProfile, exact: true })).toHaveCount(0);
  await expect(page.getByText(username, { exact: true })).toHaveCount(0);
});
