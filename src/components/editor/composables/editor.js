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
    this.model = ref(createModel(value.value));
    this.dataSource = dataSource;
    this.editable = editable;
    this.emit = emit;
    this.graph = ref(null);

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

    this.svReady = ref(false);
    this.onSvResize = this.onSvResize.bind(this);
    this.onSvCreated = this.onSvCreated.bind(this);
  }

  onSvResize() {
    this.graph.value?.instance.onResize();
  }

  onSvCreated() {
    this.svReady.value = true;
  }
}

export default Editor;
