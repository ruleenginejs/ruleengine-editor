<template>
  <v-graph-canvas
    v-model:viewport="cvViewport"
    v-model:zoom="cvZoom"
    :selected="model.selected"
    :min-zoom="minZoom"
    :max-zoom="maxZoom"
    :edge-sizes="edgeSizes"
    :resize-delay="resizeDelay"
    :zoom-intensity="zoomIntensity"
    @update:selected="onObjectSelected(model, $event)"
    ref="canvas"
  >
    <template #node>
      <v-graph-circle-node
        v-for="node in model.navNodes"
        :key="node.id"
        :id="node.id"
        :title="node.name"
        :x="node.positionX"
        :y="node.positionY"
        :error="node.isErrorNode"
        :link-rule="linkRule"
        :title-length="node.titleLength"
        :selected="node.selected"
        v-model:invalidate="node.invalidate"
        @update:selected="onObjectSelected(node, $event)"
        @change-position="onChangeNodePosition(node, $event)"
        @new-link="onNewLink"
      >
        <template #port>
          <v-graph-port :key="node.ports[0].id" :id="node.ports[0].id" />
        </template>
      </v-graph-circle-node>
      <v-graph-node
        v-for="node in model.stepNodes"
        :key="node.id"
        :id="node.id"
        :title="node.name"
        :x="node.positionX"
        :y="node.positionY"
        :header-color="node.headerColor"
        :link-rule="linkRule"
        :selected="node.selected"
        v-model:invalidate="node.invalidate"
        @update:selected="onObjectSelected(node, $event)"
        @change-position="onChangeNodePosition(node, $event)"
        @new-link="onNewLink"
      >
        <template #header-left-icon>
          <v-icon-doc-text />
        </template>
        <template v-if="node.hasHandler" #header-right-icon>
          <v-icon-script />
        </template>
        <template #left>
          <v-graph-port
            v-for="port in node.inPorts"
            :key="port.id"
            :id="port.id"
            :error="port.isErrorPort"
            :disabled="port.disabled"
            :link-limit="port.linkLimit"
            :link-rule="linkRule"
            direction="left"
            :selected="port.selected"
            @update:selected="onObjectSelected(port, $event)"
            @new-link="onNewLink"
          >{{ port.name }}</v-graph-port>
        </template>
        <template #right>
          <v-graph-port
            v-for="port in node.outPorts"
            :key="port.id"
            :id="port.id"
            :error="port.isErrorPort"
            :disabled="port.disabled"
            :link-limit="port.linkLimit"
            :link-rule="linkRule"
            direction="right"
            :selected="port.selected"
            @update:selected="onObjectSelected(port, $event)"
            @new-link="onNewLink"
          >{{ port.name }}</v-graph-port>
        </template>
      </v-graph-node>
    </template>
    <template #connection>
      <v-graph-connection
        v-for="connection in model.connections"
        :key="connection.id"
        :id="connection.id"
        :from="connection.from"
        :to="connection.to"
        :color="connection.color"
        :selected="connection.selected"
        @update:selected="onObjectSelected(connection, $event)"
      />
    </template>
  </v-graph-canvas>
</template>

<script>
import {
  VGraphCanvas,
  VGraphCircleNode,
  VGraphNode,
  VGraphPort,
  VGraphConnection,
  VIconDocText,
  VIconScript
} from "@ruleenginejs/ruleengine-ui";
import { toRefs } from "vue";
import useEditorGraph from "./composables/use-editor-graph";

export default {
  name: "v-editor-graph",
  components: {
    VGraphCanvas,
    VGraphCircleNode,
    VGraphNode,
    VGraphPort,
    VGraphConnection,
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
  emits: ["update:viewport", "update:zoom", "created"],
  setup(props, { emit }) {
    const { model, viewport, zoom, resizeDelay } = toRefs(props);
    const graph = useEditorGraph({
      model,
      viewport,
      zoom,
      resizeDelay,
      emit
    });

    const {
      canvas,
      cvViewport,
      cvZoom,
      cvSelected,
      circleNodes,
      stepNodes,
      zoomIntensity,
      onObjectSelected,
      onChangeNodePosition,
      linkRule,
      onNewLink
    } = graph;

    return {
      instance: graph,
      canvas,
      cvViewport,
      cvZoom,
      cvSelected,
      circleNodes,
      stepNodes,
      zoomIntensity,
      onObjectSelected,
      onChangeNodePosition,
      linkRule,
      onNewLink
    };
  }
};
</script>
