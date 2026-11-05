import { test, expect } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { localizeText as text } from '../src/i18n/localize';
import { ui } from '../src/i18n/account';
import { openCreativityGame, openResults, savedProgress } from './session-helpers';
// «Imprimir» abre la ventana de impresión; «Guardar PDF» descarga un .pdf generado dentro del propio informe.
test('Informe descargado: «Imprimir» imprime y «Guardar PDF» descarga un PDF, también en árabe', async ({ page, browser }, testInfo) => {
  await openCreativityGame(page);
  await page.getByLabel(/Cuéntanos tu invento/).fill('Una barca voladora');
  await savedProgress(page, () => page.getByRole('button', { name: 'Guardar mi invento' }).click());
  await page.getByRole('button', { name: /a seguir jugando/ }).click();
  await openResults(page);
  for (const lang of ['es', 'ar'] as const) {
    if (lang === 'ar') {
      await page.getByRole('button', { name: `${ui('es').language}: Español`, exact: true }).click();
      await page.getByRole('menuitemradio', { name: /العربية/ }).click();
    }
    const dl = page.waitForEvent('download');
    await page.getByTitle(text(lang, 'Descargar documento oficial formateado para imprimir'), { exact: true }).click();
    const file = await dl;
    expect(file.suggestedFilename()).toMatch(/\.html$/);
    const path = testInfo.outputPath(`informe-${lang}.html`);
    const html = await readFile((await file.path())!, 'utf8');
    expect(html).toContain('data:image/jpeg;base64,');
    await writeFile(path, html);
    const reportContext = await browser.newContext({ offline: true });
    const view = await reportContext.newPage();
    await view.setViewportSize({ width: 1100, height: 760 });
    await view.goto(pathToFileURL(path).href);
    await expect.poll(() => view.getByRole('img', { name: 'KoraMAP', exact: true }).evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await view.evaluate(() => { (window as any).__printed = 0; window.print = () => { (window as any).__printed++; }; });
    const pdf = view.waitForEvent('download', { timeout: 60000 });
    await view.locator('#save-pdf').click();
    const pdfFile = await pdf;
    expect(pdfFile.suggestedFilename()).toMatch(/\.pdf$/);
    const bytes = await readFile((await pdfFile.path())!);
    expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
    await view.locator('.actions .ghost').click();
    expect(await view.evaluate(() => (window as any).__printed)).toBe(1);
    await reportContext.close();
  }
});
