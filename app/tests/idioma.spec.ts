import { expect, test } from '@playwright/test';

test('El menú de idiomas se abre con clic, sigue abierto y se cierra al elegir, al pulsar fuera o con Esc', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox').fill('Zorro Azul');
  await page.getByRole('button', { name: /Entrar|Enter/ }).first().click();
  const globe = page.locator('header button[aria-controls="lang-menu"]');
  const menu = page.locator('#lang-menu');

  await globe.click();
  await page.mouse.move(10, 400);
  await page.waitForTimeout(1500);
  await expect(menu).toBeVisible();

  await menu.getByRole('button', { name: /English/ }).click();
  await expect(menu).toHaveCount(0);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await globe.click();
  await page.mouse.click(10, 400);
  await expect(menu).toHaveCount(0);

  await globe.click();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
});
