import { computed, ref } from "vue";

class EditorGraph {
  constructor({
    model,
    viewport,
    zoom,
    emit
  }) {
    this.model = model;
    this.emit = emit;
    this.canvas = ref(null);

    this.canvasViewport = computed({
      get: () => viewport.value,
      set: (val) => this.emit("update:viewport", val)
    });
    this.canvasZoom = computed({
      get: () => zoom.value,
      set: (val) => this.emit("update:zoom", val)
    });
    this.canvasSelected = computed({
      get: () => model.value.selected,
      set: (val) => model.value.selected = val
    });
  }
}

export default EditorGraph;
