<template>
  <div class="v-editor">
    <v-editor-error v-if="model.error" :error="model.error" />
    <v-split-view
      v-else
      :snap-offset="svSnapOffset"
      :resize-delay="resizeDelay"
    >
      <v-split-pane>
        <v-editor-graph
          :model="model"
          v-model:viewport="viewport"
          v-model:zoom="zoom"
          :min-zoom="cvMinZoom"
          :max-zoom="cvMaxZoom"
          :edge-sizes="cvEdgeSizes"
          :resize-delay="resizeDelay"
          ref="graph"
        />
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
  VSidebar
} from "@ruleenginejs/ruleengine-ui-kit-vue";
import VEditorGraph from "./v-editor-graph";
import VEditorError from "./v-editor-error";

const defaultEdgeSizes = Object.freeze({
  edgeBottomSize: { in: 10, out: 0 }
});

export default {
  name: "v-editor",
  components: {
    VSplitView,
    VSplitPane,
    VSidebar,
    VEditorGraph,
    VEditorError
  },
  props: {
    value: {
      type: [String, Object],
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
    const { viewport, zoom, graph, model } = editor;

    return {
      instance: editor,
      viewport,
      zoom,
      graph,
      model
    };
  }
};
</script>

<style>
@import "editor";
</style>
