import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  use: { baseURL: 'http://127.0.0.1:3000', channel: process.platform === 'win32' ? 'msedge' : undefined, viewport: { width: 1366, height: 900 } },
  webServer: { command: 'npm run dev -- --host 127.0.0.1 --strictPort', url: 'http://127.0.0.1:3000', reuseExistingServer: !process.env.CI },
});
