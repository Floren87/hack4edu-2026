import { defineConfig } from '@playwright/test';

// Explicit opt-in: this suite creates fictitious accounts/students on Render.
// It deletes its own students and revokes sessions, but there is no account-delete API.
export default defineConfig({
  testDir: './tests', testMatch: '**/*.live.spec.ts', workers: 1, retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    channel: process.platform === 'win32' ? 'msedge' : undefined,
    viewport: { width: 1366, height: 900 },
    actionTimeout: 20_000,
    trace: 'off', // Do not save Bearer headers or credentials in a trace artifact.
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 3000 --strictPort',
    url: 'http://localhost:3000', reuseExistingServer: true,
    // No env override: exercise the public default actually shipped by this branch.
  },
});
