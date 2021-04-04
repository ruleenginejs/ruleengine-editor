<template>
  <v-graph-canvas
    v-model:viewport="canvasViewport"
    v-model:zoom="canvasZoom"
    v-model:selected="canvasSelected"
    :min-zoom="minZoom"
    :max-zoom="maxZoom"
    :edge-sizes="edgeSizes"
    :resize-delay="resizeDelay"
    ref="canvas"
  >
  </v-graph-canvas>
</template>

<script>
import { VGraphCanvas } from "@ruleenginejs/ruleengine-ui-kit-vue";
import { toRefs } from "@vue/reactivity";
import useEditorGraph from "./composables/use-editor-graph";

export default {
  name: "v-editor-graph",
  components: {
    VGraphCanvas
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    viewport: {
      type: Array,
      required: true
    },
    zoom: {
      type: Number,
      required: true
    },
    minZoom: {
      type: Number,
      default: undefined
    },
    maxZoom: {
      type: Number,
      default: undefined
    },
    edgeSizes: {
      type: Object,
      default: undefined
    },
    resizeDelay: {
      type: Number,
      default: undefined
    }
  },
  emits: ["update:viewport", "update:zoom"],
  setup(props, { emit }) {
    const { model, viewport, zoom } = toRefs(props);
    const graph = useEditorGraph({ model, viewport, zoom, emit });
    const { canvasViewport, canvasZoom, canvasSelected } = graph;

    return {
      instance: graph,
      canvasViewport,
      canvasZoom,
      canvasSelected
    };
  }
};
</script>
