import { createApp } from 'vue'
import App from './App.vue'
import RikiList from "riki";
const app = createApp(App)
app.use(RikiList)
app.mount('#app')

