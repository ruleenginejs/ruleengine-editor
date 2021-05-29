<template>
  <div class="v-editor">
    <v-editor-error v-if="model.error" :error="model.error" />
    <v-split-view
      v-else
      :snap-offset="splitViewSnapOffset"
      :resize-delay="resizeDelay"
      @resize="onSplitViewResize"
      @created="onSplitViewCreated"
    >
      <v-split-pane>
        <v-editor-graph
          v-if="splitViewCreated"
          ref="graph"
          v-model:viewport="viewportModel"
          v-model:zoom="zoomModel"
          :model="model"
          :min-zoom="minZoom"
          :max-zoom="maxZoom"
          :edge-sizes="edgeScrollSizes"
          :resize-delay="resizeDelay"
          @created="onGraphCreated"
        />
      </v-split-pane>
      <v-split-pane v-if="sidebarEnabled" :size="`${sidebarSize}px`">
        <v-editor-sidebar
          v-if="splitViewCreated"
          :selected-object="model.selectedObject"
          :edit-delay="editDelay"
          @edit="onSidebarEdit"
        />
      </v-split-pane>
    </v-split-view>
  </div>
</template>

<script>
import { toRefs } from "vue";
import { VSplitView, VSplitPane } from "@ruleenginejs/ruleengine-ui-kit-vue";
import VEditorGraph from "./v-editor-graph";
import VEditorError from "./v-editor-error";
import VEditorSidebar from "./v-editor-sidebar";
import useEditor from "./composables/use-editor";

const defaultEdgeScrollSizes = Object.freeze({
  edgeBottomSize: { in: 10, out: 0 }
});

export default {
  name: "v-editor",
  components: {
    VSplitView,
    VSplitPane,
    VEditorSidebar,
    VEditorGraph,
    VEditorError
  },
  props: {
    value: {
      type: [String, Object],
      default: null
    },
    provider: {
      type: Object,
      default: null
    },
    editable: {
      type: Boolean,
      default: true
    },
    editDelay: {
      type: Number,
      default: 500
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
    edgeScrollSizes: {
      type: Object,
      default: () => defaultEdgeScrollSizes
    },
    sidebarEnabled: {
      type: Boolean,
      default: true
    },
    sidebarSize: {
      type: Number,
      default: 280
    },
    sidebarBorder: {
      type: Boolean,
      default: false
    },
    splitViewSnapOffset: {
      type: Number,
      default: 70
    },
    resizeDelay: {
      type: Number,
      default: 100
    }
  },
  emits: ["change-value", "update:viewport", "update:zoom"],
  setup(props, { emit }) {
    const { value, provider, editable, viewport, zoom, autoFit } = toRefs(
      props
    );

    const editor = useEditor({
      value,
      provider,
      editable,
      viewport,
      zoom,
      autoFit,
      emit
    });

    const {
      viewportModel,
      zoomModel,
      graph,
      model,
      onSplitViewResize,
      onSplitViewCreated,
      splitViewCreated,
      onGraphCreated,
      onSidebarEdit
    } = editor;

    return {
      instance: editor,
      viewportModel,
      zoomModel,
      graph,
      model,
      onSplitViewResize,
      onSplitViewCreated,
      splitViewCreated,
      onGraphCreated,
      onSidebarEdit
    };
  }
};
</script>

<style>
@import "editor";
</style>
