import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('English covers onboarding, all games and all six worlds', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByTitle('Idioma: EN').click();
  await expect(page.getByRole('heading', { name: 'Create Your Secret Explorer Profile!' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('textbox').fill('Explorer Alpha');
  await page.getByRole('button', { name: 'Enter and Start My Adventure!' }).click();
  await expect(page.getByText('Welcome back, explorer!', { exact: true })).toBeVisible();

  for (const title of ['What Do You Invent?', 'Patterns & Sequences', 'Tell the Story', 'Help Robot Bobi']) {
    await page.getByRole('button', { name: new RegExp(title.replace(/[?&]/g, '\\$&')) }).filter({ hasText: 'Play now' }).click();
    await expect(page.getByRole('button', { name: /Volver|Guardar|Siguiente/ })).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/Bandeja|Elige tu respuesta|Paso 1|Misión de Cooperación/);
    await page.getByTitle('Go to Talent Without Borders home').click();
  }

  for (const world of ['Building World', 'Exploring World', 'Creating World', 'Helping World', 'Organizing World', 'Counting World']) {
    await page.getByRole('button', { name: 'Open Worlds Map' }).click();
    await page.getByRole('button', { name: new RegExp(world) }).click();
    await expect(page.getByRole('button', { name: /Back to Worlds/ })).toBeVisible();
    await expect(page.locator('main')).not.toContainText(/Guardar|Piezas Disponibles|Cofre de Cuidados|Vacío|Cuenco vacío|Descubiertas/);
    await page.getByTitle('Go to Talent Without Borders home').click();
  }
  expect(errors).toEqual([]);
});

test('English reports preserve notes, separate student reviews, and export in English', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem('talento_sf_lang_v1', 'en'));
  await page.goto('/');
  await page.getByRole('button', { name: 'Open the Professional Dashboard' }).click();
  await expect(page.getByRole('heading', { name: 'Student Activity Log and Status' })).toBeVisible();
  await expect(page.locator('main')).not.toContainText(/Secuencias y Patrones|Mundo Construir:|Pendiente de realizar|Descubrió/);
  const notes = page.getByPlaceholder('Add educator qualitative observations...');
  await notes.fill('Observed while playing with blocks.');
  await page.getByRole('button', { name: 'Save and Confirm Review' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByTitle('Download a formatted report for printing').click();
  const download = await downloadPromise;
  const html = await readFile((await download.path())!, 'utf8');
  expect(html).toContain('<html lang="en">');
  expect(html).toContain('Observed while playing with blocks.');
  expect(html).not.toContain('Pendiente de realizar');

  await page.locator('select').first().selectOption('student_2');
  await expect(notes).toHaveValue('');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('select').first().selectOption('student_1');
  await expect(notes).toHaveValue('Observed while playing with blocks.');
  await page.screenshot({ path: testInfo.outputPath('professional-en.png'), fullPage: true });
  await page.getByRole('button', { name: 'Family Portal', exact: true }).click();
  await expect(page.getByText('Family-Friendly Summary', { exact: true })).toBeVisible();
  const familyDownload = page.waitForEvent('download');
  await page.getByTitle('Download formatted summary').click();
  const familyHtml = await readFile((await (await familyDownload).path())!, 'utf8');
  expect(familyHtml).toContain('<html lang="en">');
  expect(familyHtml).toContain('Ideas for Home');
  await page.getByRole('button', { name: 'en', exact: true }).click();
  await page.getByRole('button', { name: /Español/ }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByText('Informe Amigable para la Familia', { exact: true })).toBeVisible();
});
