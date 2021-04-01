<template>
  <div class="v-editor">
    <v-split-view :snap-offset="svSnapOffset" :resize-delay="resizeDelay">
      <v-split-pane>
        <v-graph-canvas
          v-model:viewport="viewport"
          v-model:zoom="zoom"
          v-model:selected="selected"
          :min-zoom="cvMinZoom"
          :max-zoom="cvMaxZoom"
          :edge-sizes="cvEdgeSizes"
          :resize-delay="resizeDelay"
          ref="canvas"
        >
        </v-graph-canvas>
      </v-split-pane>
      <v-split-pane :size="`${sidebarSize}px`">
        <v-sidebar :lt-border="sidebarBorder" w-full h-full></v-sidebar>
      </v-split-pane>
    </v-split-view>
  </div>
</template>

<script>
import { toRefs } from "vue";
import useEditor from "./composables/use-editor";
import {
  VSplitView,
  VSplitPane,
  VSidebar,
  VGraphCanvas
} from "@ruleenginejs/ruleengine-ui-kit-vue";

const defaultEdgeSizes = Object.freeze({
  edgeBottomSize: { in: 10, out: 0 }
});

export default {
  name: "v-editor",
  components: {
    VSplitView,
    VSplitPane,
    VSidebar,
    VGraphCanvas
  },
  props: {
    value: {
      type: String,
      default: null
    },
    dataSource: {
      type: Object,
      default: null
    },
    editable: {
      type: Boolean,
      default: true
    },
    cvViewport: {
      type: Array,
      default: () => [0, 0]
    },
    cvZoom: {
      type: Number,
      default: 100
    },
    cvMinZoom: {
      type: Number,
      default: 20
    },
    cvMaxZoom: {
      type: Number,
      default: 300
    },
    cvEdgeSizes: {
      type: Object,
      default: () => defaultEdgeSizes
    },
    sidebarSize: {
      type: Number,
      default: 250
    },
    sidebarBorder: {
      type: Boolean,
      default: false
    },
    svSnapOffset: {
      type: Number,
      default: 30
    },
    resizeDelay: {
      type: Number,
      default: 100
    }
  },
  emits: ["change-value", "update:cvViewport", "update:cvZoom"],
  setup(props, { emit }) {
    const { value, dataSource, editable, cvViewport, cvZoom } = toRefs(props);
    const editor = useEditor({
      value,
      dataSource,
      editable,
      cvViewport,
      cvZoom,
      emit
    });
    const { viewport, zoom, selected, canvas } = editor;

    return {
      instance: editor,
      viewport,
      zoom,
      selected,
      canvas
    };
  }
};
</script>

<style>
@import "editor";
</style>
