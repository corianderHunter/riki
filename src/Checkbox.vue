<template>
  <label class="riki-checkbox">
    <input
      ref="inputRef"
      :checked="modelValue"
      @input="$emit('update:modelValue', $event?.target?.checked)"
      type="checkbox"
    />
    <span class="riki-checkbox-label">
      <slot
        ><div style="font-size: 16px">
          {{ label || "" }}
        </div></slot
      >
    </span>
  </label>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "RikiCheckbox",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Boolean,
      required: false,
    },
    label: {
      type: [String, Number],
      required: false,
      default: "",
    },
  },
  mounted() {
    console.log(this.modelValue);
  },
  methods: {},
});
</script>
<style lang="scss" scoped>
$black: #363839;
$lightgray: #9c9e9f;
$gray: #bdc1c6;
$white: #fff;
$active: #409eff;
.riki-checkbox {
  font-size: 14px;
  .riki-checkbox-label {
    display: inline-block;
  }
  input[type="checkbox"] {
    position: relative;
    width: 14px;
    height: 14px;
    color: $black;
    border: 1px solid $active;
    border-radius: 2px;
    appearance: none;
    outline: 0;
    cursor: pointer;
    transition: background 175ms cubic-bezier(0.1, 0.1, 0.25, 1);
    vertical-align: bottom;
    margin: 3px 4px 3px 3px;
    &::before {
      position: absolute;
      content: "";
      display: block;
      top: 1px;
      left: 4px;
      width: 2px;
      height: 6px;
      border-style: solid;
      border-color: $white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      opacity: 0;
    }
    &:checked {
      color: $white;
      border-color: $active;
      background: $active;
      &::before {
        opacity: 1;
      }
      ~ label::before {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      }
    }
  }
}
</style>