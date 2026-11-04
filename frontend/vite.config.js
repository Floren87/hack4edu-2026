import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// En GitHub Pages la app vive en /hack4edu-2026/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/hack4edu-2026/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'TalentoSinFronteras',
        short_name: 'Talento',
        description: 'Descubre las fortalezas de cada niño y niña a través del juego',
        theme_color: '#14213D',
        background_color: '#F6F3EC',
        display: 'standalone',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
    }),
  ],
})
