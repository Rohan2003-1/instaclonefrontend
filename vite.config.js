import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://instaclonebackend-1.onrender.com',
      '/uploads': 'https://instaclonebackend-1.onrender.com',
    }
  }
})
