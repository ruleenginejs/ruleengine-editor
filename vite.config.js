import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'RuleEngineEditor',
      fileName: (format) => `ruleengine-editor.${format}.js`
    },
    rollupOptions: {
      external: [
        'vue',
        'debounce',
        '@ruleenginejs/ruleengine-ui',
        'is-plain-object',
        'merge'
      ],
      output: {
        globals: {
          vue: 'Vue',
          debounce: 'debounce',
          '@ruleenginejs/ruleengine-ui': 'RuleEngineUI',
          'is-plain-object': 'isPlainObject',
          merge: 'merge'
        },
        exports: 'named'
      }
    }
  }
})
