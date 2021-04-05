<template>
  <v-graph-canvas
    v-model:viewport="cvViewport"
    v-model:zoom="cvZoom"
    :selected="model.selected"
    :min-zoom="minZoom"
    :max-zoom="maxZoom"
    :edge-sizes="edgeSizes"
    :resize-delay="resizeDelay"
    @update:selected="onObjectSelected(model, $event)"
    ref="canvas"
  >
    <template #node>
      <v-graph-circle-node
        v-for="node in circleNodes"
        :key="node.id"
        :id="node.id"
        :title="node.name"
        v-model:x="node.positionX"
        v-model:y="node.positionY"
        :error="node.isErrorNode"
        :linkRule="node.linkRule"
        :selected="node.selected"
        @update:selected="onObjectSelected(node, $event)"
      />
      <v-graph-node
        v-for="node in stepNodes"
        :key="node.id"
        :id="node.id"
        :title="node.name"
        v-model:x="node.positionX"
        v-model:y="node.positionY"
        :headerColor="node.headerColor"
        :linkRule="node.linkRule"
        :selected="node.selected"
        @update:selected="onObjectSelected(node, $event)"
      >
        <template #header-left-icon>
          <v-icon-doc-text />
        </template>
        <template v-if="node.hasHandler" #header-right-icon>
          <v-icon-script />
        </template>
      </v-graph-node>
    </template>
  </v-graph-canvas>
</template>

<script>
import {
  VGraphCanvas,
  VGraphCircleNode,
  VGraphNode,
  VIconDocText,
  VIconScript
} from "@ruleenginejs/ruleengine-ui-kit-vue";
import { toRefs } from "@vue/reactivity";
import useEditorGraph from "./composables/use-editor-graph";

export default {
  name: "v-editor-graph",
  components: {
    VGraphCanvas,
    VGraphCircleNode,
    VGraphNode,
    VIconDocText,
    VIconScript
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
    const { model, viewport, zoom, resizeDelay } = toRefs(props);
    const graph = useEditorGraph({ model, viewport, zoom, resizeDelay, emit });
    const {
      canvas,
      cvViewport,
      cvZoom,
      cvSelected,
      circleNodes,
      stepNodes,
      onObjectSelected
    } = graph;

    return {
      instance: graph,
      canvas,
      cvViewport,
      cvZoom,
      cvSelected,
      circleNodes,
      stepNodes,
      onObjectSelected
    };
  }
};
</script>
