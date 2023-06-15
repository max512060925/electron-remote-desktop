import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    UnoCSS(),
    AutoImport({
      include: [/\.[tj]sx?$/],
      imports: ['react', 'react-router-dom'],
      dirs: [
        'src/api',
        'src/store',
        'src/router',
        'src/components',
        'src/utils/**',
      ],
      dts: 'src/auto-imports.d.ts',
      // resolvers: [
      //   IconsResolver({
      //     prefix: false, // 自动引入的Icon组件统一前缀，默认为 i，设置false为不需要前缀
      //     enabledCollections: ['icon'],
      //     extension: 'jsx',
      //   }),
      // ],
    }),
    // Icons({
    //   compiler: 'jsx',
    //   defaultClass: 'svg-icon',
    //   jsx: 'react', // jsx支持
    //   customCollections: {
    //     icon: FileSystemIconLoader('./src/assets/icon'),
    //   },
    // }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3100,
  },
})
