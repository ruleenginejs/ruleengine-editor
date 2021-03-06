# ruleengine-editor [![npm version](https://badge.fury.io/js/%40ruleenginejs%2Feditor.svg)](https://badge.fury.io/js/%40ruleenginejs%2Feditor)

> Pipeline editor made in node graph written in Vue 3.0

## Installation

```bash
npm install @ruleenginejs/editor @ruleenginejs/ui
```

Add Icons

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
import RuleEngineEditor from "@ruleenginejs/editor"
// Add css styles
import "@ruleenginejs/ui/dist/normalize.css"
import "@ruleenginejs/ui/dist/style.css"
import "@ruleenginejs/ui/dist/dark.theme.css"
import "@ruleenginejs/editor/dist/style.css"

const app = createApp(App)

app.use(RuleEngineEditor)

app.mount('#app')
```

In your templates

```html
<v-editor value="editor value..." />
```

Example editor value

```json
{
  "title": "Title",
  "description": "Description",
  "steps": [
    {
      "id": 1,
      "type": "start",
      "connect": [
        {
          "stepId": 2,
          "dstInPort": "port1"
        }
      ],
      "canvas": {
        "position": [50, 50]
      }
    },
    {
      "id": 2,
      "type": "single",
      "name": "Example step",
      "props": {
        "a": 1,
        "b": 2
      },
      "handlerFile": "./handler.js",
      "ports": {
        "in": ["port1"],
        "out": ["port2"]
      },
      "connect": [
        {
          "stepId": 3
        }
      ],
      "canvas": {
        "position": [150, 50],
        "color": "#1795D4"
      }
    },
    {
      "id": 3,
      "type": "end",
      "canvas": {
        "position": [600, 150]
      }
    }
  ]
}
```

## License

Licensed under the [MIT License](./LICENSE).
