import { createApp } from 'vue'
import App from './App.vue'
import RuleEngineEditor from "./index"
import "@vscode/codicons/dist/codicon.css"
import "@ruleenginejs/ruleengine-ui/dist/dark.theme.css"

const app = createApp(App)

app.use(RuleEngineEditor)
app.mount('#app')
