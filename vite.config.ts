import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
      'antd/dist/reset.css': path.join(__dirname, 'node_modules/antd/dist/reset.css'),  // <-- add this
      antd: path.join(__dirname, 'node_modules/antd/dist/antd.js'),
      '@ant-design/icons': path.join(__dirname, 'node_modules/@ant-design/icons/dist/index.umd.js'),
    }
  },
  server: {
    proxy: {
      "/socket": {
        target: "ws://167.88.186.119:3200",
        ws: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/.pnpm/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
})
