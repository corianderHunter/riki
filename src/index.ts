import { App } from "vue";
import RikiTable from './RikiTable.vue'

export default {
  install(app: App, config: any[]) {
    console.log('RikiTable')
    app.component('RikiTable', RikiTable)
  }
}