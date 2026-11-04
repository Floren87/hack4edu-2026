import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('El comentario del niño sale en el panel, la familia y los informes, pero no se guarda en el perfil', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('textbox').fill('Zorro Azul');
  await page.getByRole('button', { name: /Entrar|Enter/ }).first().click();
  await page.getByRole('button', { name: /¿Qué Inventas\?/ }).first().click();

  const comment = 'Es una barca <b>para</b> cruzar el río';
  await page.getByRole('button', { name: 'Me gusta mucho' }).click();
  await page.getByLabel(/Cuéntanos tu invento/).fill(comment);
  await expect(page.getByText(`${comment.length}/200`)).toBeVisible();
  await page.getByRole('button', { name: 'Guardar mi invento' }).click();
  await page.getByRole('button', { name: /a seguir jugando/ }).click(); // cierra la ventana de insignia nueva

  // Nunca en localStorage (perfil y telemetría).
  const local = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  expect(local).not.toContain('cruzar el río');

  // Panel profesional: tarjeta y informe descargado (con el HTML escapado).
  await page.locator('header').getByRole('button', { name: /Panel Profesional/ }).click();
  const card = page.getByTestId('child-comments');
  await expect(card).toContainText(comment);
  await expect(card).toContainText('😄');
  const download = page.waitForEvent('download');
  await page.getByTitle('Descargar documento oficial formateado para imprimir').click();
  const html = await readFile((await (await download).path())!, 'utf8');
  expect(html).toContain('En palabras del niño o la niña');
  expect(html).toContain('Es una barca &lt;b&gt;para&lt;/b&gt; cruzar el río');

  // Espacio familiar: tarjeta y resumen descargado.
  await page.locator('header').getByRole('button', { name: /Espacio Familiar/ }).click();
  await expect(page.getByTestId('child-comments')).toContainText(comment);
  const familyDownload = page.waitForEvent('download');
  await page.getByTitle('Descargar resumen formateado').click();
  expect(await readFile((await (await familyDownload).path())!, 'utf8')).toContain('cruzar el río');

  // En otra pestaña ya no está (sessionStorage es por pestaña).
  const other = await context.newPage();
  await other.goto('/');
  expect(await other.evaluate(() => JSON.stringify({ ...sessionStorage }))).not.toContain('cruzar el río');
  await other.close();

  // «Borrar ahora» lo elimina también de esta pestaña.
  await page.getByRole('button', { name: 'Borrar ahora' }).click();
  await expect(page.getByTestId('child-comments')).toHaveCount(0);
  expect(await page.evaluate(() => JSON.stringify({ ...sessionStorage }))).not.toContain('cruzar el río');
});

test('Sin comentario ni emojis no aparece ninguna tarjeta', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox').fill('Zorro Azul');
  await page.getByRole('button', { name: /Entrar|Enter/ }).first().click();
  await page.getByRole('button', { name: /¿Qué Inventas\?/ }).first().click();
  await page.getByRole('button', { name: 'Guardar mi invento' }).click();
  await page.getByRole('button', { name: /a seguir jugando/ }).click(); // cierra la ventana de insignia nueva
  await page.locator('header').getByRole('button', { name: /Panel Profesional/ }).click();
  await expect(page.getByTestId('child-comments')).toHaveCount(0);
});
