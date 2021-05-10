# ruleengine-editor-vue

## Installation

```bash
npm install @ruleenginejs/ruleengine-editor-vue vscode-codicons
```

Use tailwindcss base (recommended)

```bash
npm install tailwindcss
```

In your styles

```css
@import "tailwindcss/base";
```

## Usage

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import RuleEngineEditor from "@ruleenginejs/ruleengine-editor-vue"
import "@ruleenginejs/ruleengine-editor-vue/dist/ruleengine-editor-vue.css"
import "vscode-codicons/dist/codicon.css" // add codeicons

const app = createApp(App)

app.use(RuleEngineEditor)

app.mount('#app')
```

In your templates

```html
<v-editor value="your editor content..." />
```
