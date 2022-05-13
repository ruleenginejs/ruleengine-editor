<template>
  <div
    ref="container"
    class="v-editor"
    :class="{ 'v-editor--focused': focused }"
    :tabindex="keyboard ? tabIndex : null"
    @keyup.delete="keyboard ? onKeyboardDeleteKey($event) : null"
    @focusin="keyboard ? onFocusIn($event) : null"
    @focusout="keyboard ? onFocusOut($event) : null"
  >
    <v-editor-error v-if="model.error" :error="model.error" />
    <v-editor-empty v-else-if="model.isEmptyValue">
      <template v-if="$slots.empty" #default>
        <slot name="empty"></slot>
      </template>
    </v-editor-empty>
    <v-editor-graph
      v-if="!model.error"
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
import { toRefs } from 'vue';
import VEditorGraph from './v-editor-graph.vue';
import VEditorError from './v-editor-error.vue';
import VEditorEmpty from './v-editor-empty.vue';
import useEditor from './composables/use-editor';

const defaultEdgeScrollSizes = Object.freeze({
  edgeBottomSize: { in: 10, out: 0 }
});

export default {
  name: 'v-editor',
  components: {
    VEditorGraph,
    VEditorError,
    VEditorEmpty
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
    keyboard: {
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
    },
    tabIndex: {
      type: Number,
      default: -1
    }
  },
  emits: [
    'change-value',
    'change-selection',
    'graph-created',
    'update:viewport',
    'update:zoom'
  ],
  setup(props, { emit }) {
    const { value, provider, editable, viewport, zoom, autoFit, keyboard } =
      toRefs(props);

    const editor = useEditor({
      value,
      provider,
      editable,
      viewport,
      zoom,
      autoFit,
      keyboard,
      emit
    });

    const {
      viewportModel,
      zoomModel,
      graph,
      model,
      container,
      focused,
      onGraphCreated,
      onKeyboardDeleteKey,
      onFocusIn,
      onFocusOut
    } = editor;

    return {
      instance: editor,
      viewportModel,
      zoomModel,
      graph,
      model,
      container,
      focused,
      onGraphCreated,
      onKeyboardDeleteKey,
      onFocusIn,
      onFocusOut
    };
  }
};
</script>

<style>
@import 'editor';
</style>
