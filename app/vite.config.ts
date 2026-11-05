import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import {resolveApiBaseUrl} from './src/utils/apiConfig.ts';

// Política de seguridad (CSP) solo en el build: el servidor de desarrollo inyecta scripts propios.
// La página solo carga sus propios archivos y solo se conecta a la API configurada.
// 'unsafe-inline' en estilos hace falta por los style={{…}} de React; los scripts no lo permiten.
function contentSecurityPolicy(apiBaseUrl: string): Plugin {
  const policy = [
    "default-src 'self'", "script-src 'self'", "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:", "font-src 'self' data:", `connect-src 'self' ${new URL(apiBaseUrl).origin}`,
    "manifest-src 'self'", "worker-src 'self' blob:", "object-src 'none'", "base-uri 'self'", "form-action 'self'",
  ].join('; ');
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: html => html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`),
  };
}

export default defineConfig(({mode}) => {
  const apiBaseUrl = resolveApiBaseUrl(loadEnv(mode, import.meta.dirname, 'VITE_').VITE_API_BASE_URL);
  return {
    base: './',
    plugins: [react(), tailwindcss(), contentSecurityPolicy(apiBaseUrl)],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
