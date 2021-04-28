


<template>
  <div class="big-list">
    <riki-list :itemSize="40" :itemCount="1000">
      <template v-slot="scope">
        <div class="demo-row">{{ scope }}</div></template
      >
    </riki-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BigList",
  data() {
    return {};
  },
  components: {},
});
</script>

<style lang="scss">
.big-list {
  margin: 100px auto;
  width: 1000px;
  height: 777px;
  border: 1px solid #e5e5e5;
  .demo-row {
    text-align: center;
    &:nth-child(2n) {
      background-color: #d2d2d2;
    }
  }
}
</style>
