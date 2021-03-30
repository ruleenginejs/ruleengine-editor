import { createApp } from 'vue'
import App from './App.vue'
import EditorPlugin from "./index"

const app = createApp(App)

app.use(EditorPlugin)
app.mount('#app')
