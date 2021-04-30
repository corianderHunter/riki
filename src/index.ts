import { App } from "vue";
import RikiTable from './RikiTable.vue';

export * from './type';

export default {
  install(app: App, config: any[]) {
    app.component('RikiTable', RikiTable)
  }
}