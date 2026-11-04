import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  root: 'src',
  envDir: process.cwd(),
  publicDir: '../public',
  base: process.env.VITE_BASE_PATH || loadEnv(mode, process.cwd(), '').VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Keep the framework cached when only copy or translations change.
        manualChunks(id) {
          if (id.includes('node_modules/')) return 'vendor'
        },
      },
    },
  },
}))
