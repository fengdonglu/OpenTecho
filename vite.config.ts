import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia'],
          pdf: ['jspdf'],
          lunar: ['lunar-javascript']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
