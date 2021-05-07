import { App } from "vue";
import table from './table.vue';

export * from './type';

export default {
  install(app: App, config: any[]) {
    app.component('RikiTable', table)
  }
}