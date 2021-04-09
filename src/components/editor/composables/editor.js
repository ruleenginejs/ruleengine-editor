import { ref, watch } from "vue";
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
    this.splitViewCreated = ref(false);
    this.viewportModel = ref(viewport.value);
    this.zoomModel = ref(zoom.value);

    this.onSplitViewResize = this.onSplitViewResize.bind(this);
    this.onSplitViewCreated = this.onSplitViewCreated.bind(this);
    this.onGraphCreated = this.onGraphCreated.bind(this);
    this.onChangeModelContent = this.onChangeModelContent.bind(this);

    this.model.value.selected = true;
    this.model.value.addChangeListener(this.onChangeModelContent);

    this.initWatchers({ value, viewport, zoom });
  }

  initWatchers({ value, viewport, zoom }) {
    watch(value, () => {
      this.setValue(value.value);
    });

    watch(viewport, () => {
      this.viewportModel.value = viewport.value;
    });

    watch(zoom, () => {
      this.zoomModel.value = zoom.value;
    });

    watch(this.viewportModel, () => {
      this.emit("update:viewport", this.viewportModel.value);
    });

    watch(this.zoomModel, () => {
      this.emit("update:zoom", this.zoomModel.value);
    });
  }

  getModel() {
    return this.model.value;
  }

  getValue() {
    return this.model.value.getValue();
  }

  setValue(value) {
    this.model.value.setValue(value);
  }

  setZoom(zoom) {
    this.zoomModel.value = zoom;
  }

  setViewport(viewport) {
    this.viewportModel.value = viewport;
  }

  fitCanvas(maxZoom = null) {
    this.graph.value?.instance.fitCanvas(maxZoom);
  }

  onSplitViewResize() {
    this.graph.value?.instance.onResize();
  }

  onSplitViewCreated() {
    this.splitViewCreated.value = true;
  }

  onGraphCreated() {
    if (this.autoFit.value) {
      this.fitCanvas(this.zoomModel.value);
    }
  }

  onChangeModelContent(e) {
    this.emit("change-value", e);
  }
}

export default Editor;
