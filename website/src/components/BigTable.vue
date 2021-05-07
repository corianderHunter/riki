


<template>
  <div style="width: 1000px; margin: 10px auto">
    <div>构造<input v-model="dataCount" />条数据</div>
    <div>高度设为<input v-model="itemCount" />px</div>
    <div>简单模式 总条数 <input v-model="dataCount" /></div>
    <div>滚到 <input v-model="showIndex" /> 条</div>
  </div>
  <div class="big-table">
    <riki-table
      ref="rikiTable"
      :withIndex="true"
      :withSelection="true"
      :itemSize="Number(itemSize)"
      :itemConfig="configs"
      :dataSource="listData"
      :noDataRender="renderNoData"
    >
    </riki-table>
  </div>
  <div style="width: 1000px; margin: 10px auto">
    <div>简单模式 总条数<input v-model="itemCount" /></div>
  </div>
  <div class="big-table">
    <riki-table
      :withIndex="true"
      :itemSize="Number(itemSize)"
      :itemCount="Number(itemCount)"
      :noDataRender="renderNoData"
    >
      <template v-slot:default="slotProps"
        ><div>{{ slotProps.value }}</div>
      </template>
    </riki-table>
  </div>
</template>

<script lang="tsx">
import { h, defineComponent } from "vue";
import { ItemConfig } from "riki";

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
  address: "nanjing",
  phoneNo: "13243421111",
  remark: "test remark",
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
    return {
      configs,
      dataCount: 1220,
      itemSize: 40,
      itemCount: 1000,
      showIndex: 0,
    };
  },
  computed: {
    listData(): any[] {
      return buildData(this.dataCount);
    },
  },
  mounted() {},
  watch: {
    showIndex(v) {
      const rikiTable = this.$refs.rikiTable;
      rikiTable?.scrollToIndex(v);
    },
  },
  methods: {
    renderNoData() {
      return <div>暂无数据昂....</div>;
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
