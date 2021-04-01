import { computed, ref } from "vue";

class Editor {
  constructor({
    value,
    dataSource,
    editable,
    cvViewport,
    cvZoom,
    emit
  }) {
    this.value = value;
    this.dataSource = dataSource;
    this.editable = editable;
    this.emit = emit;
    this.canvas = ref(null);
    this.selected = ref(true);

    this.viewport = computed({
      get: () => cvViewport.value,
      set: (val) => this.emit("update:cvViewport", val)
    });
    this.zoom = computed({
      get: () => cvZoom.value,
      set: (val) => this.emit("update:cvZoom", val)
    });
  }
}

export default Editor;
