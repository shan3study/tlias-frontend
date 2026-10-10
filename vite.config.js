import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        //目标服务器地址
        target: 'http://localhost:8080',
        //修改请求头中的 Host（来源域名）
        changeOrigin: true,
        //允许代理到 HTTPS 证书有问题的服务器。
        secure: false,
        //重写路径，将/api替换为空字符串
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
