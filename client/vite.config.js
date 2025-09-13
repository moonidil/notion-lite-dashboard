import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // All /api/* calls go to your Node API at :5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
