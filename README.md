# ruleengine-editor

> Rule editor made in node graph written in Vue 3.0

## Installation

```bash
npm install @ruleenginejs/ruleengine-editor
```

Use [tailwindcss](https://github.com/tailwindlabs/tailwindcss) (for reset style)

```bash
npm install tailwindcss
```

In your styles

```css
@import "tailwindcss/base";
```

Add [codicons](https://github.com/microsoft/vscode-codicons)

```bash
npm install @vscode/codicons
```

In your code
```javascript
import "@vscode/codicons/dist/codicon.css"
```

## Usage

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import RuleEngineEditor from "@ruleenginejs/ruleengine-editor"
import "@ruleenginejs/ruleengine-editor/dist/ruleengine-editor.css"
import "@ruleenginejs/ruleengine-ui/dist/dark.theme.css"

const app = createApp(App)

app.use(RuleEngineEditor)

app.mount('#app')
```

In your templates

```html
<v-editor value="your editor content..." />
```

## License

Licensed under the [MIT License](./LICENSE).
