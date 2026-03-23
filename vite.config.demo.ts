import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'demo',
  base: '/dassprism/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      dassprism: resolve(__dirname, 'src/index.ts'),
    },
  },
})
