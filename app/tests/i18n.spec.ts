import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import { ui } from '../src/i18n/account';
import { translations } from '../src/i18n/translations';
import { LANGUAGES } from '../src/i18n/languages';
import { localizeText as text, messageCatalogs, languages, direction } from '../src/i18n/localize';
import type { Language } from '../src/types';

const password = 'Demo-i18n-passphrase-2026';
const exactPattern = (value: string) => new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
async function changeLanguage(page: Page, language: Language) {
  const current = await page.locator('html').getAttribute('lang') as Language;
  const name = LANGUAGES.find(item => item.id === language)!.name;
  await page.getByRole('button', { name: `${ui(current).language}: ${LANGUAGES.find(item => item.id === current)!.name}`, exact: true }).click();
  await page.getByRole('menuitemradio', { name: exactPattern(name) }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', language);
  await expect(page.locator('html')).toHaveAttribute('dir', direction(language));
}

// Inspect visible copy AND accessible labels/tooltips. Native language names,
// aliases and professional notes are intentional untranslated user data.
async function noForeignCopy(page: Page, language: Language) {
  if (language === 'es' || language === 'en') return;
  const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
  const copy = await page.evaluate(() => {
    const strings: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement?.getClientRects().length && !node.parentElement.closest('script, style, [aria-hidden="true"]')) strings.push(node.textContent ?? '');
    }
    document.querySelectorAll('[aria-label], [title], [placeholder]').forEach(element => {
      for (const name of ['aria-label', 'title', 'placeholder']) if (element.hasAttribute(name)) strings.push(element.getAttribute(name)!);
    });
    return strings;
  });
  const values = (lang: Language) => [...Object.values(messageCatalogs[lang]), ...Object.values(ui(lang)), ...Object.values(translations[lang])];
  const current = new Set([...values(language), ...LANGUAGES.map(item => item.name)].map(normalize));
  const foreign = new Set([...values('es'), ...values('en')].map(normalize).filter(value => value.length > 2 && !value.includes('{')));
  const leftovers = copy.map(normalize).filter(value => foreign.has(value) && !current.has(value));
  expect([...new Set(leftovers)], `Unexpected ES/EN copy in ${language}`).toEqual([]);
}
async function closeBadge(page: Page, language: Language) {
  const button = page.getByRole('button', { name: text(language, '¡Genial, a seguir jugando!'), exact: true });
  if (await button.isVisible()) await button.click();
}
async function saved(page: Page, language: Language) {
  await closeBadge(page, language);
  await expect(page.getByRole('status')).toHaveText(ui(language).saved);
  await noForeignCopy(page, language);
}
async function playCore(page: Page, language: Language, title: string) {
  await page.getByRole('button', { name: exactPattern(title) }).filter({ hasText: text(language, 'Jugar ahora') }).click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await noForeignCopy(page, language);
}
async function playWorld(page: Page, language: Language, title: string) {
  await page.getByRole('button', { name: exactPattern(title) }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await noForeignCopy(page, language);
}
async function download(page: Page, language: Language, family: boolean) {
  const pending = page.waitForEvent('download');
  await page.getByTitle(text(language, family ? 'Descargar resumen formateado' : 'Descargar documento oficial formateado para imprimir'), { exact: true }).click();
  const file = await pending;
  expect(file.suggestedFilename()).toMatch(new RegExp('^' + text(language, family ? 'Resumen para la familia' : 'Informe profesional').replace(/[^\p{L}\p{N}_-]+/gu, '_') + '_'));
  const html = await fs.readFile((await file.path())!, 'utf8');
  expect(html).toContain(`<html lang="${language}" dir="${direction(language)}">`);
  expect(html).toContain(text(language, family ? 'Resumen para la familia' : 'Informe profesional'));
  expect(html).toContain(text(language, 'Imprimir'));
  expect(html).toContain(text(language, 'Guardar PDF'));
  expect(html).toContain('window.html2pdf');
  const preview = await page.context().newPage();
  await preview.setContent(html);
  await noForeignCopy(preview, language);
  await preview.close();
}

for (const language of languages) test(`${language}: ten complete games, live language switching, professional/family reports and exports`, async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  page.setDefaultTimeout(10_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('group').getByRole('button', { name: 'English', exact: true }).click();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await page.getByLabel('Made-up username').fill(`i18n-${language}-${Date.now()}`);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'My students' })).toBeVisible();
  await changeLanguage(page, language);
  const t = ui(language), base = translations[language], message = (source: string) => text(language, source);
  await page.getByRole('button', { name: t.newStudent, exact: true }).click();
  await page.getByLabel(t.alias, { exact: true }).fill('Demo-i18n');
  await noForeignCopy(page, language);
  await page.screenshot({ path: testInfo.outputPath(`create-${language}.png`) });
  await page.getByRole('button', { name: t.save, exact: true }).click();
  await page.getByRole('article').getByRole('button', { name: t.results, exact: true }).click();
  await expect(page.getByRole('button', { name: message('Imprimir Informe'), exact: true })).toBeVisible();
  await noForeignCopy(page, language); // all pending report branches
  await page.getByRole('navigation').getByRole('button', { name: t.students, exact: true }).click();
  await page.getByRole('button', { name: t.play, exact: true }).click();
  await expect(page.getByRole('button', { name: t.back, exact: true })).toBeVisible();
  await noForeignCopy(page, language);

  await playCore(page, language, base.gameCreativityTitle);
  await page.getByRole('button', { name: exactPattern(message('🚀 Transporte volador o espacial')) }).click();
  await page.getByRole('button', { name: base.gameCreativityFinish, exact: true }).click();
  await saved(page, language);
  await page.getByRole('button', { name: message('Volver a la Zona de Juegos'), exact: true }).click();

  await playCore(page, language, base.gameLogicTitle);
  await page.getByRole('button', { name: exactPattern(message('Círculo Amarillo')) }).click();
  await expect(page.getByText(message('¡Buen intento! Cada prueba te acerca a la regla. Vuelve a mirar la secuencia con calma.'), { exact: true })).toBeVisible();
  await page.getByRole('button', { name: message('Ver pista'), exact: true }).click();
  await expect(page.getByText(message('Mira el orden: rojo, azul, verde... y vuelve a empezar: rojo, azul...'), { exact: true })).toBeVisible();
  await noForeignCopy(page, language);
  for (const answer of ['Cuadrado Verde', 'Dos lunas', 'Cuadro oscuro lleno']) await page.getByRole('button', { name: exactPattern(message(answer)) }).click();
  await saved(page, language);
  await page.getByRole('button', { name: message('Volver a la Zona de Juegos'), exact: true }).click();

  await playCore(page, language, base.gameStoryTitle);
  await page.getByTitle(message('Mover a la derecha'), { exact: true }).first().click();
  await page.getByTitle(message('Sorprendido'), { exact: true }).first().click();
  await page.getByRole('button', { name: message('Guardar mi Historia Contada'), exact: true }).click();
  await saved(page, language);
  await page.getByRole('button', { name: message('Volver a la Zona de Juegos'), exact: true }).click();

  await playCore(page, language, base.gameRobotTitle);
  await expect(page.getByText(message('Bobi tiene poca energía y camina lento. ¡Comparte baterías de luz!'), { exact: true })).toBeVisible();
  await page.getByRole('button', { name: exactPattern(message('Compartir Batería Solar (+35%)')) }).click({ clickCount: 2, delay: 100 });
  await page.getByRole('button', { name: exactPattern(message('Pincel de acuarelas')) }).click();
  await expect(page.getByText(message('Bobi mira esa herramienta con curiosidad pero necesita apretar tuercas con la llave.'), { exact: true })).toBeVisible();
  // Existing state must translate immediately, without restarting the game.
  const alternate = language === 'en' ? 'uk' : 'en';
  await changeLanguage(page, alternate);
  await expect(page.getByText(text(alternate, 'Bobi mira esa herramienta con curiosidad pero necesita apretar tuercas con la llave.'), { exact: true })).toBeVisible();
  await changeLanguage(page, language);
  await page.getByRole('button', { name: exactPattern(message('Llave inglesa de ajuste')) }).click();
  await page.getByRole('button', { name: message('Darle una caricia protectora y chocar la mano 🤝'), exact: true }).click();
  await saved(page, language);
  await page.getByRole('button', { name: message('Volver a la Zona de Juegos'), exact: true }).click();
  await page.getByRole('button', { name: message('Abrir Mapa de Mundos'), exact: true }).click();

  await playWorld(page, language, base.worldBuildTitle);
  await page.getByRole('button', { name: exactPattern(message('Piedra Base Ancha')) }).click({ clickCount: 2, delay: 100 });
  await changeLanguage(page, alternate);
  await expect(page.getByText(text(alternate, 'Piedra Base Ancha'), { exact: true })).toHaveCount(3);
  await changeLanguage(page, language);
  await page.getByRole('button', { name: message('Guardar Estructura Zen (+2 ⭐)'), exact: true }).click();
  await saved(page, language);
  await page.getByRole('button', { name: message('Volver a Mundos'), exact: true }).first().click();

  await playWorld(page, language, base.worldExploreTitle);
  for (const source of ['Zorro Estelar', 'Búho Sabio', 'Delfín Cósmico', 'Mariposa de Luz']) {
    await page.getByRole('button', { name: `${message('Toca para despertar la constelación')}: ${message(source)}`, exact: true }).first().click();
  }
  await page.getByRole('button', { name: message('Guardar Exploración (+2 ⭐)'), exact: true }).click();
  await saved(page, language);
  await page.getByRole('button', { name: message('Volver a Mundos'), exact: true }).first().click();

  await playWorld(page, language, base.worldCreateTitle);
  await page.getByText(message('Toca con el dedo o ratón para despertar notas de color'), { exact: true }).locator('..').locator('..').click({ clickCount: 3, delay: 100 });
  await page.getByRole('button', { name: message('Guardar Sinfonía (+2 ⭐)'), exact: true }).click();
  await saved(page, language);
  await page.getByRole('button', { name: message('Volver a Mundos'), exact: true }).first().click();

  await playWorld(page, language, base.worldHelpTitle);
  for (const [creature, care] of [['Pip, el polluelo cósmico', 'Auriculares de Algodón Silencioso'], ['Lumi, la medusa de cristal', 'Manta Suave de Lana Cálida'], ['Bramble, el erizo del musgo', 'Frasco de Agua Fresca con Bayas']]) {
    await page.getByRole('button', { name: message(creature), exact: true }).click();
    await page.getByRole('button', { name: exactPattern(message(care)) }).click();
    await noForeignCopy(page, language);
  }
  await saved(page, language);
  await page.getByRole('button', { name: message('Volver a Mundos'), exact: true }).first().click();

  await playWorld(page, language, base.worldOrganizeTitle);
  for (let i = 0; i < 6; i++) await page.getByTitle(text(language, 'Mover al Cuenco {0}', [(i % 3) + 1]), { exact: true }).first().click();
  await page.getByRole('button', { name: message('Por textura y tacto'), exact: true }).click();
  await page.getByRole('button', { name: message('Guardar Clasificación (+2 ⭐)'), exact: true }).click();
  await saved(page, language);
  await page.getByRole('button', { name: message('Volver a Mundos'), exact: true }).first().click();

  await playWorld(page, language, base.worldCountTitle);
  await page.getByRole('button', { name: exactPattern(message('Estrella Dorada')) }).click({ clickCount: 2, delay: 100 });
  await page.getByRole('button', { name: message('¡Balanza Equilibrada! Guardar (+2 ⭐)'), exact: true }).click();
  await saved(page, language);
  await page.getByRole('button', { name: t.back, exact: true }).click();
  await page.getByLabel(t.password, { exact: true }).fill(password);
  await page.getByRole('dialog').getByRole('button', { name: t.back, exact: true }).click();
  await page.getByRole('article').getByRole('button', { name: t.results, exact: true }).click();
  await expect(page.getByRole('heading', { name: message('¿Qué Inventas?'), exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: new RegExp(exactPattern(message('Realizadas (')).source + '\\s*10\\)') })).toBeVisible();
  await noForeignCopy(page, language); // all completed report branches, with saved evidence
  await page.getByPlaceholder(base.teacherNotesPlaceholder).fill('Keep this professional note verbatim.');
  await page.getByRole('button', { name: message('Guardar y Validar Informe'), exact: true }).click();
  await expect(page.getByRole('button', { name: message('¡Validación Guardada!'), exact: true })).toBeVisible();
  await download(page, language, false);
  for (const width of [390, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`results-${language}-${width}.png`) });
  }
  await page.getByRole('navigation').getByRole('button', { name: t.family, exact: true }).click();
  await expect(page.getByRole('navigation').getByRole('button', { name: t.family, exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('button', { name: message('Imprimir Resumen Familiar'), exact: true })).toBeVisible();
  await noForeignCopy(page, language);
  await download(page, language, true);
  for (const width of [390, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`family-${language}-${width}.png`) });
  }
  expect(errors).toEqual([]);
});
