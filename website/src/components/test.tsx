import {h, reactive} from 'vue'
import RikiCheckbox from "../../../src/Checkbox.vue";

const Test = {
  setup() {
    const state = reactive({test:true})
    return () =><RikiCheckbox v-model={state.test} >testets</RikiCheckbox>;
  },
};


export  default Test