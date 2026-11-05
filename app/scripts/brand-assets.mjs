import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// The JPEG is the untouched source supplied and approved by the team.
// Render it inside a square SVG, preserving its full aspect ratio, then create app icons.
const original = await readFile(new URL('../public/koramap-logo.jpeg', import.meta.url));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>KoraMAP</title><rect width="512" height="512" fill="white"/><image width="512" height="512" preserveAspectRatio="xMidYMid meet" href="data:image/jpeg;base64,${original.toString('base64')}"/></svg>\n`;
const browser = await chromium.launch({ channel: process.platform === 'win32' ? 'msedge' : undefined });
try {
  const page = await browser.newPage();
  await writeFile(new URL('../public/icon.svg', import.meta.url), svg);
  for (const size of [192, 512]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;width:100%;height:100%}svg{display:block;width:100%;height:100%}</style>${svg}`);
    await page.locator('image').evaluate(async image => {
      const loaded = new Image(); loaded.src = image.getAttribute('href'); await loaded.decode();
    });
    await page.screenshot({ path: fileURLToPath(new URL(`../public/icon-${size}.png`, import.meta.url)) });
  }
} finally { await browser.close(); }
console.log(`Brand icons generated. Original SHA-256: ${createHash('sha256').update(original).digest('hex')}`);
