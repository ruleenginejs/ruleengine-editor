<template>
  <div />
</template>

<script>
import { toRefs } from "@vue/reactivity";
import useEditor from "./composables/use-editor";

export default {
  name: "v-editor",
  props: {
    value: {
      type: String,
      default: null
    },
    dataSource: {
      type: Object,
      default: null
    }
  },
  emits: ["change-value"],
  setup(props, { emit }) {
    const { value, dataSource } = toRefs(props);
    const editor = useEditor({ value, dataSource, emit });

    return {
      instance: editor
    };
  }
};
</script>
