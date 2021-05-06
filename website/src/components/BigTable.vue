


<template>
  <div style="width: 1000px; margin: 10px auto">
    <div>构造<input v-model="dataCount" />条数据</div>
    <div>高度设为<input v-model="itemSize" />px</div>
  </div>
  <RikiCheckbox v-model="test"></RikiCheckbox>
  <div class="big-table">
    <riki-table
      :withIndex="true"
      :withSelection="true"
      :itemSize="Number(itemSize)"
      :itemConfig="configs"
      :dataSource="listData"
      :noDataRender="renderNoData"
    >
    </riki-table>
  </div>
</template>

<script lang="tsx">
import { h, defineComponent } from "vue";
import { ItemConfig } from "riki";
import RikiCheckbox from "../../../src/Checkbox.vue";

const configs: ItemConfig[] = [
  { label: "姓名", dataIndex: "name" },
  { label: "地址", dataIndex: "address" },
  { label: "号码", dataIndex: "phoneNo", width: 80 },
  {
    label: "备注",
    dataIndex: "remark",
    render: (item: any) => {
      return item["remark"] + "rendered by renderFunction";
    },
  },
];

const testData = {
  name: "11",
  address: "雨花台起大风大",
  phoneNo: "13243421111",
  remark: "张峰利答复法发大水发达",
};

const buildData = (count: number) =>
  Array.from({ length: count })
    .fill(null)
    .map((val, index) => {
      return { ...testData, id: index + 1 };
    });

export default defineComponent({
  name: "BigTable",
  data() {
    return { configs, dataCount: 1220, itemSize: 40, test: true };
  },
  components: {
    RikiCheckbox,
  },
  computed: {
    listData(): any[] {
      return buildData(this.dataCount);
    },
  },
  watch: {
    test(v) {
      console.log(this.test);
    },
  },
  methods: {
    renderNoData() {
      return <div>暂无数据昂....</div>;
    },
    onInput(v: any) {
      console.log(v);
    },
    onChange(v: any) {
      console.log(v);
    },
  },
});
</script>

<style lang="scss">
.big-table {
  margin: 0 auto;
  width: 1000px;
  height: 777px;
  .demo-row {
    text-align: center;
    &:nth-child(2n) {
      background-color: #d2d2d2;
    }
  }
}
</style>
