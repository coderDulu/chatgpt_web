import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

const config = loadEnv('development', './')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    splitVendorChunkPlugin(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
    visualizer(),
    viteCompression()
  ],
  css: {
    postcss: {
      // plugins: [pxtoViewport()]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      "/ws": {
        target: `ws://${config.VITE_WSSERVER}:3200`,
        ws: true
      }
    }
  },
  build: {
    rollupOptions: {
      cache: true,
      treeshake: true,
      output: {
        manualChunks: {
          'ant-design-vue': ['ant-design-vue'],
          '@ant-design/icons-vue': ['@ant-design/icons-vue'],
          'animate.css': ['animate.css']
        }
      }
    }
  },
})
