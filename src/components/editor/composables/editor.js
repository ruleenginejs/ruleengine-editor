import { computed, ref, watch } from "vue";
import { createModel } from "./graph-model";

class Editor {
  constructor({
    value,
    dataSource,
    editable,
    cvViewport,
    cvZoom,
    emit
  }) {
    debugger;
    this.model = ref(createModel(value.value));
    this.dataSource = dataSource;
    this.editable = editable;
    this.emit = emit;
    this.canvas = ref(null);

    this.viewport = computed({
      get: () => cvViewport.value,
      set: (val) => this.emit("update:cvViewport", val)
    });
    this.zoom = computed({
      get: () => cvZoom.value,
      set: (val) => this.emit("update:cvZoom", val)
    });

    watch(value, () => {
      this.model.value = createModel(value.value);
    });
  }
}

export default Editor;
