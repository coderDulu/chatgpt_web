import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteCompression from 'vite-plugin-compression'


// https://vitejs.dev/config/
console.log(path.join(__dirname, 'node_modules/react-syntax-highlighter/dist/cjs'));
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin(), viteCompression()],
  resolve: {
    alias: {
      "@": path.join(__dirname, 'src'),
      'antd/dist/reset.css': path.join(__dirname, 'node_modules/antd/dist/reset.css'),  // <-- add this
      "antd": path.join(__dirname, 'node_modules/antd/dist/antd.js'),
      '@ant-design/icons': path.join(__dirname, 'node_modules\\@ant-design\\icons\\lib\\index.js'),
      // 'react-syntax-highlighter/styles/prism': path.join(__dirname, 'node_modules/react-syntax-highlighter/dist/cjs/styles/prism'),
      // 'react-syntax-highlighter': path.join(__dirname, 'node_modules/react-syntax-highlighter/dist/cjs'),
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
      cache: true,
      treeshake: true,
    }
  }
})
