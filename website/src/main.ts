import { createApp } from 'vue'
import App from './App.vue'
import RikiTable from "riki";
const app = createApp(App)
app.use(RikiTable)
app.mount('#app')

