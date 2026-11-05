import { expect, type Page } from '@playwright/test';
import { ui } from '../src/i18n/account';

// Recorrido real desde #19: cuenta profesional ficticia → alumno → modo niño.
// Solo pseudónimos y contraseñas de prueba; la API de los e2e usa una base en memoria.
export const PASSWORD = 'Demo-creatividad-2026';
const t = ui('es');

export async function startChildSession(page: Page, alias = 'Zorro Azul') {
  await page.goto('/');
  await page.getByRole('button', { name: t.register, exact: true }).click();
  await page.getByLabel(t.username).fill(`qa-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  await page.getByLabel(t.password, { exact: true }).fill(PASSWORD);
  await page.getByRole('button', { name: t.register, exact: true }).click();
  await page.getByRole('button', { name: t.newStudent, exact: true }).click();
  await page.getByLabel(t.alias, { exact: true }).fill(alias);
  await page.getByRole('button', { name: t.save, exact: true }).click();
  await page.getByRole('button', { name: t.play, exact: true }).click();
}

export async function openCreativityGame(page: Page) {
  await startChildSession(page);
  await page.getByRole('button', { name: /¿Qué Inventas\?/ }).filter({ hasText: 'Jugar ahora' }).click();
  await expect(page.locator('[data-piece-id]').first()).toBeVisible();
}

/** Sale del modo niño con la contraseña y abre «Resultados» del alumno. */
export async function openResults(page: Page) {
  await page.getByRole('button', { name: t.back, exact: true }).click();
  await page.getByLabel(t.password, { exact: true }).fill(PASSWORD);
  await page.getByRole('dialog').getByRole('button', { name: t.back, exact: true }).click();
  await page.getByRole('article').getByRole('button', { name: t.results, exact: true }).click();
}

export async function openFamily(page: Page) {
  await page.getByRole('navigation').getByRole('button', { name: t.family, exact: true }).click();
}

/** Espera el PUT de progreso que dispara la acción y devuelve su cuerpo. */
export async function savedProgress(page: Page, action: () => Promise<void>) {
  const request = page.waitForRequest(r => r.method() === 'PUT' && r.url().endsWith('/progress'));
  await action();
  return (await request).postData() ?? '';
}
