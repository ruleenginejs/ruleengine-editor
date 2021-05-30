<template>
  <div class="v-editor">
    <v-editor-error v-if="model.error" :error="model.error" />
    <v-editor-graph
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
  </div>
</template>

<script>
import { toRefs } from "vue";
import VEditorGraph from "./v-editor-graph";
import VEditorError from "./v-editor-error";
import useEditor from "./composables/use-editor";

const defaultEdgeScrollSizes = Object.freeze({
  edgeBottomSize: { in: 10, out: 0 }
});

export default {
  name: "v-editor",
  components: {
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
    resizeDelay: {
      type: Number,
      default: 100
    }
  },
  emits: ["change-value", "update:viewport", "update:zoom", "graph-created"],
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

    const { viewportModel, zoomModel, graph, model, onGraphCreated } = editor;

    return {
      instance: editor,
      viewportModel,
      zoomModel,
      graph,
      model,
      onGraphCreated
    };
  }
};
</script>

<style>
@import "editor";
</style>
