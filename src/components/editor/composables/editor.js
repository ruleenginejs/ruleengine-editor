import { computed, ref, watch, nextTick } from "vue";
import { createModel } from "./graph-model";

class Editor {
  constructor({
    value,
    dataSource,
    editable,
    viewport,
    zoom,
    autoFit,
    emit
  }) {
    this.model = ref(createModel(value.value));
    this.dataSource = dataSource;
    this.editable = editable;
    this.emit = emit;
    this.autoFit = autoFit;
    this.graph = ref(null);
    this.svReady = ref(false);
    this.selectedObject = ref(this.model.value);

    this.onSvResize = this.onSvResize.bind(this);
    this.onSvCreated = this.onSvCreated.bind(this);
    this.onGraphCreated = this.onGraphCreated.bind(this);

    this.initComputed({ viewport, zoom });
    this.initWatchers({ value });
  }

  initComputed({ viewport, zoom }) {
    this.viewportModel = computed({
      get: () => viewport.value,
      set: (val) => this.emit("update:viewport", val)
    });

    this.zoomModel = computed({
      get: () => zoom.value,
      set: (val) => this.emit("update:zoom", val)
    });
  }

  initWatchers({ value }) {
    watch(value, () => {
      this.changeModel(value.value);
    });
  }

  changeModel(value) {
    this.model.value = createModel(value);
    this.selectedObject.value = this.model.value;

    nextTick(() => {
      if (this.autoFit.value) {
        this.fitCanvas(this.zoomModel.value);
      }
    });
  }

  onSvResize() {
    this.graph.value?.instance.onResize();
  }

  onSvCreated() {
    this.svReady.value = true;
  }

  onGraphCreated() {
    if (this.autoFit.value) {
      this.fitCanvas(this.zoomModel.value);
    }
  }

  fitCanvas(maxZoom = null) {
    this.graph.value?.instance.fitCanvas(maxZoom);
  }
}

export default Editor;
