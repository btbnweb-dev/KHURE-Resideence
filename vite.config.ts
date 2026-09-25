import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // GSAP is large and changes rarely; splitting it keeps the app chunk small and
        // cacheable across deploys.
        manualChunks: id => (id.includes('node_modules/gsap') ? 'gsap' : undefined),
      },
    },
  },
})
