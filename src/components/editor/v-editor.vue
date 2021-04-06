<template>
  <div class="v-editor">
    <v-editor-error v-if="model.error" :error="model.error" />
    <v-split-view
      v-else
      :snap-offset="svSnapOffset"
      :resize-delay="resizeDelay"
      @resize="onSvResize"
      @created="onSvCreated"
    >
      <v-split-pane>
        <v-editor-graph
          v-if="svReady"
          :model="model"
          v-model:viewport="viewportModel"
          v-model:zoom="zoomModel"
          :min-zoom="minZoom"
          :max-zoom="maxZoom"
          :edge-sizes="edgeSizes"
          :resize-delay="resizeDelay"
          v-model:selected-object="selectedObject"
          @created="onGraphCreated"
          ref="graph"
        />
      </v-split-pane>
      <v-split-pane :size="`${sidebarSize}px`">
        <v-sidebar
          v-if="svReady"
          :lt-border="sidebarBorder"
          w-full
          h-full
        ></v-sidebar>
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
    viewport: {
      type: Array,
      default: () => [0, 0]
    },
    autoFit: {
      type: Boolean,
      default: false
    },
    zoom: {
      type: Number,
      default: 100
    },
    minZoom: {
      type: Number,
      default: 20
    },
    maxZoom: {
      type: Number,
      default: 300
    },
    edgeSizes: {
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
  emits: ["change-value", "update:viewport", "update:zoom"],
  setup(props, { emit }) {
    const { value, dataSource, editable, viewport, zoom, autoFit } = toRefs(
      props
    );
    const editor = useEditor({
      value,
      dataSource,
      editable,
      viewport,
      zoom,
      graph,
      autoFit,
      emit
    });

    const {
      viewportModel,
      zoomModel,
      graph,
      model,
      onSvResize,
      onSvCreated,
      svReady,
      selectedObject,
      onGraphCreated
    } = editor;

    return {
      instance: editor,
      viewportModel,
      zoomModel,
      graph,
      model,
      onSvResize,
      onSvCreated,
      svReady,
      selectedObject,
      onGraphCreated
    };
  }
};
</script>

<style>
@import "editor";
</style>
