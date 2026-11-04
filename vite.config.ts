import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE_PATH || loadEnv(mode, process.cwd(), '').VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
}))
