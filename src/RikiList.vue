<script lang="tsx">
import { throttle } from "underscore";
import { defineComponent, ref, h, PropType, onMounted } from "vue";
import { Direction, RikiListProps } from "./type";

const boundaryCount = 2;

export default defineComponent({
  name: "rikiList",
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
      type: Object,
      required: false,
    },
    itemSize: {
      type: Number,
      required: true,
    },
    itemCount: {
      type: Number,
      required: true,
    },
    itemRender: {
      type: Function,
      required: false,
    },
    direction: {
      type: Object as PropType<Direction>,
      default: Direction.VERTICAL,
    },
  },
  data() {
    return {
      renderCount: 0,
      renderStartIndex: 0,
    };
  },
  created() {},
  mounted() {
    const listNode = this.$refs.listRef as HTMLElement;
    if (listNode) {
      const listSize =
        this.direction === Direction.VERTICAL
          ? listNode.offsetHeight
          : listNode.offsetWidth;

      this.renderCount =
        Math.ceil(listSize / this.itemSize) + boundaryCount * 2; //额外渲染4个
    } else {
      //todo
    }
  },
  setup(props: RikiListProps) {
    return <div></div>;
  },
  methods: {
    onScroll: throttle(function (e: UIEvent) {
      const that = this as any;
      const listNode = e.target as HTMLElement;
      const scrollDistance =
        that.direction === Direction.VERTICAL
          ? listNode.scrollTop
          : listNode.scrollLeft;
      that.renderStartIndex = Math.max(
        Math.ceil(scrollDistance / that.itemSize) - 2,
        0
      );
    }, 100),
  },

  computed: {
    _itemRender(): Function {
      const {
        $slots: { default: slotsDefault },
      } = this;
      return (slotsDefault ? slotsDefault : this.itemRender) as Function;
    },
    wrapperSize(): Number {
      return this.itemSize * this.itemCount;
    },
    totalArray(): any[] {
      return Array.from({ length: this.itemCount })
        .fill(null)
        .map((val, index) => index + 1);
    },
    renderArray(): any[] {
      return this.totalArray.slice(
        this.renderStartIndex,
        this.renderStartIndex + this.renderCount
      );
    },
  },

  render() {
    const {
      style,
      width,
      height,
      itemSize,
      wrapperSize,
      _itemRender,
      onScroll,
      renderArray,
      renderStartIndex,
      direction,
    } = this;

    return (
      <div
        style={{ ...style, width, height }}
        class="riki-list"
        ref="listRef"
        onScroll={onScroll}
      >
        <div
          class="riki-list-wrapper"
          style={{
            [direction === Direction.VERTICAL ? "height" : "width"]:
              wrapperSize + "px",
          }}
        >
          {_itemRender
            ? renderArray.map((v, index) => {
                const itemStyle = {
                  top:
                    direction === Direction.VERTICAL
                      ? (renderStartIndex + index) * itemSize + "px"
                      : 0,
                  left:
                    direction === Direction.HORIZONTAL
                      ? (renderStartIndex + index) * itemSize + "px"
                      : 0,
                };
                return (
                  <div
                    class="riki-list-item-wrapper"
                    style={{
                      ...itemStyle,
                      [direction === Direction.VERTICAL ? "height" : "width"]:
                        itemSize + "px",
                    }}
                  >
                    {_itemRender(v)}
                  </div>
                );
              })
            : "请设置渲染函数"}
        </div>
      </div>
    );
  },
});
</script>

<style lang="scss" scoped>
.riki-list {
  width: 100%;
  height: 100%;
  overflow: auto;
  .riki-list-wrapper {
    position: relative;
    .riki-list-item-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      position: absolute;
    }
  }
}
</style>