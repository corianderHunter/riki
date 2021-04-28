<script lang="tsx">
import { throttle } from "underscore";
import {
  defineComponent,
  ref,
  h,
  PropType,
  onMounted,
  computed,
  toRefs,
  reactive,
  Fragment,
} from "vue";
import { getScrollbarWidth } from "./helper";
import { Direction, RikiTableProps, ItemConfig } from "./type";

const boundaryCount = 2;

export default defineComponent({
  name: "rikiTable",
  props: {
    height: {
      type: [Number, String],
      required: false,
    },
    width: {
      type: [Number, String],
      required: false,
    },
    style: {
      type: Object as PropType<RikiTableProps["style"]>,
      required: false,
    },
    itemSize: {
      type: Number,
      required: true,
    },
    itemCount: {
      type: Number,
      required: false,
    },
    itemRender: {
      type: Function,
      required: false,
    },
    direction: {
      type: String,
      default: Direction.VERTICAL,
    },
    itemConfig: {
      type: Array,
      default: [],
    },
    dataSource: {
      type: Array,
      default: [],
      required: false,
    },
    key: {
      type: String,
      requird: true,
    },
    withIndex: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(_props, { slots }) {
    let props = _props as RikiTableProps;
    const renderStartIndex = ref(0);
    const renderCount = ref(0);
    const tableRef = ref<HTMLElement>();
    const tableHeader = ref<HTMLElement>();

    const {
      key = "id",
      withIndex = false,
      style,
      width,
      height,
      itemSize,
      itemCount = 0,
      itemRender,
      direction,
      itemConfig,
      dataSource = [],
    } = reactive(toRefs(props));

    const wrapprSize = itemSize * (dataSource.length || itemCount || 0);

    onMounted(() => {
      const tableNode = tableRef.value;
      const tableHeaderNode = tableHeader.value;
      if (tableNode) {
        const tableSize =
          direction === Direction.VERTICAL
            ? tableNode.offsetHeight
            : tableNode.offsetWidth;
        renderCount.value = Math.ceil(tableSize / itemSize) + boundaryCount * 2; //额外渲染4个
      }
      if (tableHeaderNode) {
        const barWidth = getScrollbarWidth();
        if (direction === Direction.VERTICAL) {
          tableHeaderNode.style.paddingRight = barWidth + "px";
        } else {
          tableHeaderNode.style.paddingBottom = barWidth + "px";
        }
      }
    });

    const renderTableHeader = () => {
      if (itemConfig && itemConfig.length) {
        return (
          <div class="riki-table-header" ref={tableHeader}>
            {withIndex ? <div class="table-index"></div> : null}
            {itemConfig.map(({ label, dataIndex, width }) => {
              const _width = typeof width === "number" ? width + "px" : width;
              return (
                <div
                  key={dataIndex.toString()}
                  class="riki-table-header-cell"
                  style={{ maxWidth: _width }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        );
      }
      return null;
    };

    const defaultItemRender = (item: { [p: string]: any }, index: number) => {
      const itemContent =
        itemConfig && itemConfig.length
          ? itemConfig.map(({ dataIndex, width }) => {
              const _width = typeof width === "number" ? width + "px" : width;
              return (
                <div
                  key={dataIndex.toString()}
                  class="riki-table-item-cell"
                  style={{ maxWidth: _width }}
                >
                  <div>{item[dataIndex]}</div>
                </div>
              );
            })
          : null;
      return (
        <>
          {withIndex ? <div class="table-index">{index + 1}</div> : null}
          {itemContent}
        </>
      );
    };

    const onScroll = throttle(function (e: UIEvent) {
      const tableNode = e.target as HTMLElement;
      const scrollDistance =
        direction === Direction.VERTICAL
          ? tableNode.scrollTop
          : tableNode.scrollLeft;
      requestAnimationFrame(() => {
        renderStartIndex.value = Math.max(
          Math.ceil(scrollDistance / itemSize) - 2,
          0
        );
      });
    }, 100);

    const finalItemRender = computed(() => {
      const { default: slotsDefault } = slots;
      return (slotsDefault || itemRender || defaultItemRender) as Function;
    });

    const totalArray = computed(() => {
      renderStartIndex.value = 0;
      if (itemCount) {
        return Array.from({ length: itemCount || 0 })
          .fill(null)
          .map((val, index) => index + 1);
      }
      return dataSource;
    });

    const renderArray = computed(() =>
      totalArray.value.slice(
        renderStartIndex.value,
        renderStartIndex.value + renderCount.value
      )
    );

    return () => (
      <div style={[style || {}, { width, height }]} class="riki-table">
        {renderTableHeader()}
        <div class="riki-table-body" onScroll={onScroll} ref={tableRef}>
          <div
            class="riki-table-wrapper"
            style={{
              [direction === Direction.VERTICAL ? "height" : "width"]:
                wrapprSize + "px",
            }}
          >
            {finalItemRender.value &&
            renderArray.value &&
            renderArray.value.length ? (
              renderArray.value.map((v, index) => {
                const itemStyle = {
                  top:
                    direction === Direction.VERTICAL
                      ? (renderStartIndex.value + index) * itemSize + "px"
                      : 0,
                  left:
                    direction === Direction.HORIZONTAL
                      ? (renderStartIndex.value + index) * itemSize + "px"
                      : 0,
                };
                return (
                  <div
                    class="riki-table-item"
                    key={v[key]}
                    style={{
                      ...itemStyle,
                      [direction === Direction.VERTICAL ? "height" : "width"]:
                        itemSize + "px",
                    }}
                  >
                    {finalItemRender.value(
                      v,
                      renderStartIndex.value + index,
                      renderStartIndex.value
                    )}
                  </div>
                );
              })
            ) : (
              <span>"请设置渲染函数"</span>
            )}
          </div>
        </div>
      </div>
    );
  },
});
</script>

<style lang="scss" scoped>
.riki-table {
  width: 100%;
  height: 100%;
  .table-index {
    width: 50px;
    text-align: center;
  }
  .riki-table-header {
    display: flex;
    background-color: #fafafa;
    .riki-table-header-cell {
      flex: 1;
      padding: 16px;
      font-weight: bold;
    }
  }
  .riki-table-body {
    height: calc(100% - 55px);
    overflow: auto;
  }
  .riki-table-wrapper {
    position: relative;
    .riki-table-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      position: absolute;
      .riki-table-item-cell {
        flex: 1;
        padding: 0 16px;
        & > div {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>