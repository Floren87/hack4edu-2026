import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests', testMatch:'**/*.spec.ts', workers:1,
 use:{baseURL:'http://localhost:3100',channel:process.platform==='win32'?'msedge':undefined,viewport:{width:1366,height:900}},
 webServer:[
  {command:'npm --prefix ../backend run dev',url:'http://127.0.0.1:3101/api/health',reuseExistingServer:false,env:{PORT:'3101',HOST:'127.0.0.1',ALLOWED_ORIGINS:'http://localhost:3100',DATABASE_URL:':memory:',NODE_ENV:'development'}},
  // Different hosts and ports exercise actual browser CORS, without Vite proxying.
  {command:'npm run dev -- --host 127.0.0.1 --port 3100 --strictPort',url:'http://localhost:3100',reuseExistingServer:false,env:{VITE_API_BASE_URL:'http://127.0.0.1:3101/api'}},
 ],
});
