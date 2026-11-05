import { expect, test, type Page } from '@playwright/test';
import { ui } from '../src/i18n/account';

// Recorrido real desde #19: cuenta profesional ficticia → alumno → modo niño → juego.
async function openCreativityGame(page: Page) {
  const t = ui('es');
  await page.goto('/');
  await page.getByRole('button', { name: t.register, exact: true }).click();
  await page.getByLabel(t.username).fill(`arrastrar-${Date.now()}`);
  await page.getByLabel(t.password, { exact: true }).fill('Demo-arrastrar-2026');
  await page.getByRole('button', { name: t.register, exact: true }).click();
  await page.getByRole('button', { name: t.newStudent, exact: true }).click();
  await page.getByLabel(t.alias, { exact: true }).fill('Zorro Azul');
  await page.getByRole('button', { name: t.save, exact: true }).click();
  await page.getByRole('button', { name: t.play, exact: true }).click();
  await page.getByRole('button', { name: /¿Qué Inventas\?/ }).filter({ hasText: 'Jugar ahora' }).click();
  await expect(page.locator('[data-piece-id]').first()).toBeVisible();
}

const box = async (page: Page, selector: string) => (await page.locator(selector).first().boundingBox())!;

test('Las piezas de «¿Qué inventas?» se arrastran con ratón y dedo, se mueven con flechas y no salen de la mesa', async ({ page }) => {
  await openCreativityGame(page);
  const piece = '[data-piece-id="part_umbrella"]';
  const area = await box(page, '[data-piece-id]  >> xpath=..');

  // Tocar sin mover solo selecciona: la pieza no cambia de sitio.
  const before = await box(page, piece);
  await page.locator(piece).click();
  await expect(page.locator(piece)).toHaveAttribute('aria-pressed', 'true');
  const afterTap = await box(page, piece);
  expect(Math.abs(afterTap.x - before.x)).toBeLessThan(8);

  // Arrastrar con el ratón la lleva a otro sitio.
  await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2);
  await page.mouse.down();
  await page.mouse.move(area.x + 40, area.y + 40, { steps: 8 });
  await page.mouse.up();
  const dragged = await box(page, piece);
  expect(dragged.x).toBeLessThan(before.x - 50);
  expect(dragged.x).toBeGreaterThanOrEqual(area.x - 8);
  expect(dragged.y).toBeGreaterThanOrEqual(area.y - 8);

  // Arrastrarla muy lejos la deja en el borde, dentro de la mesa.
  await page.mouse.move(dragged.x + dragged.width / 2, dragged.y + dragged.height / 2);
  await page.mouse.down();
  await page.mouse.move(area.x + area.width + 500, area.y + area.height + 500, { steps: 8 });
  await page.mouse.up();
  const edge = await box(page, piece);
  expect(edge.x + edge.width).toBeLessThanOrEqual(area.x + area.width + 12);
  expect(edge.y + edge.height).toBeLessThanOrEqual(area.y + area.height + 12);

  // Con las flechas del teclado también se mueve: 2 pulsaciones = 20 px.
  const left = async () => parseFloat(await page.locator(piece).evaluate(el => (el as HTMLElement).style.left));
  await page.locator(piece).focus();
  const leftBefore = await left();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  expect(await left()).toBe(leftBefore - 20);

  // Con el dedo (eventos de puntero táctiles) también se arrastra.
  const gear = '[data-piece-id="part_gear"]';
  const g = await box(page, gear);
  const start = { x: g.x + g.width / 2, y: g.y + g.height / 2 };
  const touch = { pointerId: 7, pointerType: 'touch', isPrimary: true, button: 0, buttons: 1 };
  await page.locator(gear).dispatchEvent('pointerdown', { ...touch, clientX: start.x, clientY: start.y });
  for (let i = 1; i <= 5; i++) {
    await page.locator(gear).dispatchEvent('pointermove', { ...touch, clientX: start.x - i * 20, clientY: start.y + i * 10 });
  }
  await page.locator(gear).dispatchEvent('pointerup', { ...touch, buttons: 0, clientX: start.x - 100, clientY: start.y + 50 });
  const touched = await box(page, gear);
  expect(touched.x).toBeLessThan(g.x - 60);

  // Al guardar, las recolocaciones llegan como evidencia para el profesional (3 arrastres + 1 serie de flechas).
  // Desde #19 la partida se guarda en la API: leemos el cuerpo del PUT de progreso.
  const progress = page.waitForRequest(request => request.method() === 'PUT' && request.url().endsWith('/progress'));
  await page.getByRole('button', { name: 'Guardar mi invento' }).click();
  const saved = (await progress).postData() ?? '';
  expect(saved).toContain('"repositionsCount":4');
  expect(saved).toContain('Recolocó piezas 4 veces para probar combinaciones.');
});
