# Riki

用 vue3 写一个简单的虚拟列表组件

## 使用方式

```
  <template>
    <riki-table
        ref="rikiTable"
        :withIndex="true"
        :itemSize="Number(itemSize)"
        :itemConfig="configs"
        :dataSource="listData"
      >
    </riki-table>
  </template>

  <script lang="tsx">
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
    })
  </script>
```

可运行 [demo](https://github.com/corianderHunter/riki/blob/main/website/src/components/BigTable.vue)  
查看 [props](https://github.com/corianderHunter/riki/blob/main/src/type.ts)

---

## 笔记

### 原理

构造一个足够大的 table 容器，table 的高度尺寸为，**每项的尺寸\*渲染总数**。
item 子项相对容器绝对定位，这样每个子项的位置就能根据索引计算。
根据容器的 scrollTop 数值，计算当前渲染的开始索引。
一般来说，渲染的实际 item 数量，比可视区域多三到四个

### 问题

- 渲染数目有上限
  > dom 节点的尺寸是有上限的，比如说 chrome，最大尺寸不超过 33554428px，
  > 所以 chrome，最大渲染数 = 33554428/每项的尺寸大小(itemSize)
- api 设计问题
  - 使用 composition Api 开发，如果想暴露一个实例 api,这个实例方法如何 access setup()的作用域。现在的方法，没有 vue 标准支撑，以后不一定可用。又或者，默认为无状态组件，所以变更都由 props 设计实现。
  - 应该提供几种 item 项渲染方式，目前，通过配置 itemConfig，或者用 default slot,或者通过 props itemRender
