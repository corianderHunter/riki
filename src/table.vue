<script lang="tsx">
import { throttle } from "underscore";
import {
  defineComponent,
  ref,
  h,
  Fragment,
  PropType,
  onMounted,
  computed,
  watch,
  getCurrentInstance,
} from "vue";
import { getScrollbarWidth } from "./helper";
import { Direction, RikiTableProps } from "./type";

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
      required: false,
    },
    key: {
      type: String,
      requird: true,
      default: "id",
    },
    withIndex: {
      type: Boolean,
      required: false,
      default: false,
    },
    border: {
      type: Boolean,
      required: false,
      default: false,
    },
    noDataRender: {
      type: Function,
      required: false,
    },
  },
  methods: {
    scrollToIndex(index: number): any {},
  },
  setup(props, { slots }) {
    const internalInstance = getCurrentInstance();
    const renderStartIndex = ref(0);
    const renderCount = ref(0);
    const tableRef = ref<HTMLElement>();
    const tableBodyRef = ref<HTMLElement>();
    const tableHeader = ref<HTMLElement>();
    const tableHeaderCells = ref<HTMLElement[]>([]);

    onMounted(() => {
      const tableBodyNode = tableBodyRef.value;
      const tableHeaderNode = tableHeader.value;
      if (tableBodyNode) {
        const tableSize =
          props.direction === Direction.VERTICAL
            ? tableBodyNode.offsetHeight
            : tableBodyNode.offsetWidth;
        renderCount.value =
          Math.ceil(tableSize / props.itemSize) + boundaryCount * 2; //额外渲染4个
      }
      if (tableHeaderNode) {
        const barWidth = getScrollbarWidth();
        if (props.direction === Direction.VERTICAL) {
          tableHeaderNode.style.paddingRight = barWidth + "px";
        } else {
          tableHeaderNode.style.paddingBottom = barWidth + "px";
        }
      }
      //注册method
      if (internalInstance) {
        if (internalInstance.ctx) {
          const tableNode = tableBodyRef.value;
          internalInstance.ctx.scrollToIndex = (index: number): any => {
            if (tableNode) {
              tableNode?.scrollTo(0, Math.max(index - 1, 0) * props.itemSize);
            }
          };
        }
      }
    });

    watch([() => props.dataSource, () => props.itemSize], () => {
      const tableBodyNode = tableBodyRef.value;
      if (tableBodyNode) {
        renderStartIndex.value = 0;
        props.direction === Direction.VERTICAL
          ? (tableBodyNode.scrollTop = 0)
          : (tableBodyNode.scrollLeft = 0);
      }
    });

    const renderTableHeader = () => {
      if (props.itemConfig && props.itemConfig.length) {
        return (
          <div class="riki-table-header" ref={tableHeader}>
            {props.withIndex ? <div class="table-index"></div> : null}
            {props.itemConfig.map(
              ({ label, dataIndex, width }: any, idx: number) => {
                const _width = typeof width === "number" ? width + "px" : width;
                return (
                  <div
                    ref={(e) =>
                      (tableHeaderCells.value[idx] = e as HTMLElement)
                    }
                    key={dataIndex.toString()}
                    class="riki-table-header-cell"
                    style={{ maxWidth: _width }}
                  >
                    {label}
                  </div>
                );
              }
            )}
          </div>
        );
      }
      return null;
    };

    const defaultItemRender = ({
      value: item,
      index,
    }: {
      value: { [p: string]: any };
      index: number;
    }) => {
      const itemContent =
        props.itemConfig && props.itemConfig.length
          ? props.itemConfig.map(
              ({ dataIndex, render }: any, index: number) => {
                const width = cellsWidth.value[index]
                  ? cellsWidth.value[index] + "px"
                  : "auto";
                return (
                  <div
                    key={dataIndex.toString()}
                    class="riki-table-item-cell"
                    style={{ width }}
                  >
                    <div>{render ? render(item) : item[dataIndex]}</div>
                  </div>
                );
              }
            )
          : null;
      return (
        <>
          {props.withIndex ? <div class="table-index">{index + 1}</div> : null}
          {itemContent}
        </>
      );
    };

    const onScroll = throttle(function (e: UIEvent) {
      const tableBodyNode = e.target as HTMLElement;
      const scrollDistance =
        props.direction === Direction.VERTICAL
          ? tableBodyNode.scrollTop
          : tableBodyNode.scrollLeft;
      requestAnimationFrame(() => {
        renderStartIndex.value = Math.max(
          Math.ceil(scrollDistance / props.itemSize) - 2,
          0
        );
      });
    }, 100);

    const wrapprSize = computed(() => {
      return (
        props.itemSize * (props.dataSource?.length || props.itemCount || 0)
      );
    });

    const finalItemRender = computed(() => {
      const { default: slotsDefault } = slots;
      return (slotsDefault ||
        props.itemRender ||
        defaultItemRender) as Function;
    });

    const totalArray = computed(() => {
      if (props.dataSource) {
        return props.dataSource;
      }
      return Array.from({ length: props.itemCount || 0 })
        .fill(null)
        .map((val, index) => index + 1);
    });

    const renderArray = computed(() =>
      totalArray?.value?.slice(
        renderStartIndex.value,
        renderStartIndex.value + renderCount.value
      )
    );

    const cellsWidth = computed(() =>
      tableHeaderCells.value.map((v) => v.offsetWidth)
    );

    return () => (
      <div
        style={[
          props.style || {},
          { width: props.width, height: props.height },
        ]}
        class="riki-table"
        ref={tableRef}
      >
        {renderTableHeader()}
        <div class="riki-table-body" onScroll={onScroll} ref={tableBodyRef}>
          {finalItemRender.value ? (
            renderArray.value && renderArray.value.length ? (
              <div
                class="riki-table-wrapper"
                style={{
                  [props.direction === Direction.VERTICAL ? "height" : "width"]:
                    wrapprSize.value + "px",
                }}
              >
                {renderArray.value.map((v: any, index) => {
                  const itemStyle = {
                    top:
                      props.direction === Direction.VERTICAL
                        ? (renderStartIndex.value + index) * props.itemSize +
                          "px"
                        : 0,
                    left:
                      props.direction === Direction.HORIZONTAL
                        ? (renderStartIndex.value + index) * props.itemSize +
                          "px"
                        : 0,
                  };
                  return (
                    <div
                      class="riki-table-item"
                      key={v[props.key]}
                      style={{
                        ...itemStyle,
                        [props.direction === Direction.VERTICAL
                          ? "height"
                          : "width"]: props.itemSize + "px",
                      }}
                    >
                      {finalItemRender.value({
                        value: v,
                        index: renderStartIndex.value + index,
                        offsetIndex: renderStartIndex.value,
                      })}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div class="riki-table-empty">
                {props.noDataRender ? props.noDataRender() : "暂无数据"}
              </div>
            )
          ) : (
            <div class="riki-table-empty">请设置渲染函数</div>
          )}
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
  .riki-table-empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .riki-table-header {
    display: flex;
    background-color: #fafafa;
    align-items: center;
    justify-content: center;
    .riki-table-header-cell {
      flex: 1;
      padding: 16px;
      font-weight: bold;
    }
  }
  .riki-table-body {
    height: calc(100% - 55px);
    overflow: auto;
    position: relative;
  }
  .riki-table-wrapper {
    position: relative;
    .riki-table-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      position: absolute;
      border-top: 1px solid #ebeef5;
      .riki-table-item-cell {
        padding: 0 16px;
        box-sizing: border-box;
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