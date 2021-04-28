


<template>
  <div class="big-table">
    <riki-table
      :withIndex="true"
      :itemSize="40"
      :itemConfig="configs"
      :dataSource="listData"
    >
    </riki-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const configs = [
  { label: "姓名", dataIndex: "name" },
  { label: "地址", dataIndex: "address" },
  { label: "号码", dataIndex: "phoneNo", width: 80 },
  { label: "备注", dataIndex: "remark" },
];

const testData = {
  name: "11",
  address: "雨花台起大风大",
  phoneNo: "13243421111",
  remark: "张峰利答复法发大水发达",
};

const buildData = () =>
  Array.from({ length: 10000 })
    .fill(null)
    .map((val, index) => {
      return { ...testData, id: index + 1 };
    });

export default defineComponent({
  name: "BigTable",
  data() {
    return { configs, listData: buildData() };
  },
  components: {},
});
</script>

<style lang="scss">
.big-table {
  margin: 100px auto;
  width: 1000px;
  height: 777px;
  border: 1px solid #ff8e8e;
  .demo-row {
    text-align: center;
    &:nth-child(2n) {
      background-color: #d2d2d2;
    }
  }
}
</style>
