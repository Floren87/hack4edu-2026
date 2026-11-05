import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadReportLogo, logoUrl } from '../src/utils/brand';

const originalUrl = new URL('../public/koramap-logo.jpeg', import.meta.url);
test('approved artwork is unchanged and favicon/installation assets use that source', async () => {
  const original = await readFile(originalUrl);
  assert.equal(createHash('sha256').update(original).digest('hex'), 'f87fb2a00faf8b556940f4a9f2d2adcfc9d7f34238f469cd419dc3a810bad5e6');
  const svg = await readFile(new URL('../public/icon.svg', import.meta.url), 'utf8');
  assert.ok(svg.includes(`data:image/jpeg;base64,${original.toString('base64')}`));
  assert.ok(svg.includes('preserveAspectRatio="xMidYMid meet"'));
  for (const size of [192, 512]) {
    const png = await readFile(new URL(`../public/icon-${size}.png`, import.meta.url));
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), size);
    assert.equal(png.readUInt32BE(20), size);
  }
  const manifest = JSON.parse(await readFile(new URL('../public/manifest.json', import.meta.url), 'utf8'));
  for (const icon of manifest.icons) {
    assert.ok(icon.src.startsWith('./'));
    assert.ok((await readFile(new URL(`../public/${icon.src}`, import.meta.url))).length > 0);
  }
});

test('reports embed the full original image without sending credentials to the asset request', async () => {
  const original = await readFile(originalUrl);
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(String(url), './koramap-logo.jpeg');
    assert.equal(options?.credentials, 'omit');
    return new Response(new Uint8Array(original), { headers: { 'Content-Type': 'image/jpeg' } });
  };
  try {
    const encoded = await loadReportLogo();
    assert.ok(encoded);
    assert.ok(encoded.startsWith('data:image/jpeg;base64,'));
    assert.ok(Buffer.from(encoded.split(',')[1]!, 'base64').equals(original));
    assert.equal(logoUrl, './icon-192.png');
  } finally { globalThis.fetch = oldFetch; }
});

test('unavailable or non-image assets do not prevent exporting a report', async () => {
  const oldFetch = globalThis.fetch;
  try {
    for (const response of [new Response('missing', { status: 404 }), new Response('<html>not an image</html>')]) {
      globalThis.fetch = async () => response;
      assert.equal(await loadReportLogo(), undefined);
    }
    globalThis.fetch = async () => { throw new Error('offline'); };
    assert.equal(await loadReportLogo(), undefined);
  } finally { globalThis.fetch = oldFetch; }
});
