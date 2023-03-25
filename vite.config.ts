import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteCompression from 'vite-plugin-compression'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin(), viteCompression()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
      'antd/dist/reset.css': path.join(__dirname, 'node_modules/antd/dist/reset.css'),  // <-- add this
      "antd": path.join(__dirname, 'node_modules/antd/dist/antd.js'),
      '@ant-design/icons': path.join(__dirname, 'node_modules\\@ant-design\\icons\\lib\\index.js'),
      'react-syntax-highlighter/dist/cjs/styles/prism': path.join(__dirname, 'node_modules/react-syntax-highlighter/dist/cjs/styles/prism/index.js'),
      'react-syntax-highlighter': path.join(__dirname, 'node_modules/react-syntax-highlighter/dist/cjs/index.js'),
    }
  },
  server: {
    proxy: {
      "/socket": {
        target: "ws://127.0.0.1:3200",
        ws: true
      }
    }
  },

  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      cache: true,
      treeshake: true,
    }
  }
})
