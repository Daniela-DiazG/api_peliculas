import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/generos': 'http://localhost:3000',
      '/directores': 'http://localhost:3000',
      '/productoras': 'http://localhost:3000',
      '/tipos': 'http://localhost:3000',
      '/media': 'http://localhost:3000',
    }
  }
})
