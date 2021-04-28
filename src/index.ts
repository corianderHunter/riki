import { App } from "vue";
import RikiList from './RikiList.vue'

export default {
  install(app: App, config: any[]) {
    console.log('RikiList')
    app.component('RikiList', RikiList)
  }
}