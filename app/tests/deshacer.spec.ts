import { expect, test, type Page } from '@playwright/test';
import { openCreativityGame, savedProgress } from './session-helpers';

const pieceIds = (page: Page) => page.locator('[data-piece-id]').evaluateAll(els => els.map(el => el.getAttribute('data-piece-id')!.replace(/_\d+$/, '')));

test('«Quitar la última» quita las piezas de la más nueva a la más antigua y «Deshacer» vuelve atrás', async ({ page }) => {
  await openCreativityGame(page);
  const undo = page.getByRole('button', { name: 'Deshacer' });
  const remove = page.getByRole('button', { name: /Quitar/ });
  await expect(undo).toBeDisabled();

  // Añade sol y pez (el pez queda seleccionado al añadirlo).
  await page.getByRole('button', { name: /Sol/ }).click();
  await page.getByRole('button', { name: /Pez/ }).click();
  expect(await pieceIds(page)).toEqual(['part_umbrella', 'part_gear', 'part_sun', 'part_fish']);

  // Con el pez seleccionado, quita el pez. Luego, sin selección, quita la última: el sol, el engranaje…
  await expect(remove).toHaveText('Quitar pieza');
  await remove.click();
  await expect(remove).toHaveText('Quitar la última');
  await remove.click();
  expect(await pieceIds(page)).toEqual(['part_umbrella', 'part_gear']);
  await remove.click();
  expect(await pieceIds(page)).toEqual(['part_umbrella']);

  // Seleccionar una pieza y tocar la mesa vacía la deselecciona.
  await page.locator('[data-piece-id="part_umbrella"]').click();
  await expect(remove).toHaveText('Quitar pieza');
  const area = (await page.locator('[data-piece-id]').first().locator('xpath=..').boundingBox())!;
  await page.mouse.click(area.x + area.width - 5, area.y + area.height - 5);
  await expect(remove).toHaveText('Quitar la última');

  // Deshacer recupera las piezas quitadas en orden inverso.
  await undo.click();
  expect(await pieceIds(page)).toEqual(['part_umbrella', 'part_gear']);
  await undo.click();
  expect(await pieceIds(page)).toEqual(['part_umbrella', 'part_gear', 'part_sun']);

  // Deshacer también devuelve una pieza arrastrada a su sitio (y Ctrl+Z hace lo mismo).
  const sun = page.locator('[data-piece-id^="part_sun"]');
  const left = async () => parseFloat(await sun.evaluate(el => (el as HTMLElement).style.left));
  const before = await left();
  const b = (await sun.boundingBox())!;
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(before > 150 ? b.x - 100 : b.x + 100, b.y + b.height / 2, { steps: 6 });
  await page.mouse.up();
  expect(Math.abs((await left()) - before)).toBeGreaterThan(50);
  await page.keyboard.press('Control+z');
  expect(await left()).toBe(before);

  // Girar también se puede deshacer.
  await sun.click();
  await page.getByRole('button', { name: /Girar/ }).click();
  const rotation = () => sun.evaluate(el => (el as HTMLElement).style.transform);
  expect(await rotation()).toBe('rotate(45deg)');
  await undo.click();
  expect(await rotation()).toBe('rotate(0deg)');

  // Al guardar queda la evidencia de que usó Deshacer.
  const saved = await savedProgress(page, () => page.getByRole('button', { name: 'Guardar mi invento' }).click());
  expect(saved).toContain('"undoCount":4');
  expect(saved).toContain('Revisó y corrigió su invento 4 veces con «Deshacer».');
});
