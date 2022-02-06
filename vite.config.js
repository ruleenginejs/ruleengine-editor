import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

const globals = {
  'vue': 'Vue',
  'debounce': 'Debounce',
  '@ruleenginejs/ui': 'RuleEngineUI',
  'is-plain-object': 'IsPlainObject'
};

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
      external: Object.keys(globals),
      output: {
        globals,
        exports: 'named'
      }
    }
  }
})
