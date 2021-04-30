<template>
  <big-table></big-table>
  <test></test>
</template>

<script lang = "ts" >
import { defineComponent } from "vue";
import BigTable from "./components/BigTable.vue";
import Test from "./components/test.tsx";
export default defineComponent({
  name: "App",
  components: {
    BigTable,
    Test,
  },
});
</script>

<style lang="scss">
body,
html {
  padding: 0;
  margin: 0;
  font-size: 14px;
}
#app {
  font-family: Inter, Roboto, Oxygen, Fira Sans, Helvetica Neue, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #2c3e50;
}
</style>
