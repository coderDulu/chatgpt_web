import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/socket': {
        target: "ws://167.88.186.119:3200",
        ws: true
      }
    }
  }
})
 