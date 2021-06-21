import { ref, watch, watchEffect } from "vue";
import { createModel } from "./graph-model";
import { CreateNode } from "./commands/create-node";

class Editor {
  constructor({
    value,
    provider,
    editable,
    viewport,
    zoom,
    autoFit,
    emit
  }) {
    this.model = ref(createModel(value.value));
    this.provider = provider;
    this.editable = editable;
    this.emit = emit;
    this.autoFit = autoFit;
    this.graph = ref(null);
    this.viewportModel = ref(viewport.value);
    this.zoomModel = ref(zoom.value);

    this.onResize = this.onResize.bind(this);
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

    watchEffect(() => {
      this.emit("change-selection", this.model.value.selectedObject);
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

  applyEdits(editCommands, emitChangeEvent = true) {
    this.model.value.applyEdits(editCommands, emitChangeEvent);
  }

  getZoom() {
    return this.zoomModel.value;
  }

  setZoom(zoom) {
    this.zoomModel.value = zoom;
  }

  getViewport() {
    return this.viewportModel.value.slice();
  }

  setViewport(viewport) {
    this.viewportModel.value = viewport;
  }

  getGraph() {
    return this.graph.value?.instance;
  }

  fitCanvas(maxZoom = null) {
    this.getGraph()?.fitCanvas(maxZoom);
  }

  newNode(type, options = null, notify = true) {
    this.model.value.applyEdits([CreateNode.createDef({ ...options, type })], notify);
  }

  newNodeInCurrentViewWithOffset(type, positionOffset, options = null, notify = true) {
    options = { ...options, type };
    const x = -this.viewportModel.value[0] + positionOffset[0];
    const y = -this.viewportModel.value[1] + positionOffset[1];
    options.canvas = {
      position: [x, y]
    }
    this.newNode(type, options, notify);
  }

  onResize() {
    this.getGraph()?.onResize();
  }

  onGraphCreated() {
    if (this.autoFit.value) {
      this.fitCanvas(this.zoomModel.value);
    }

    this.emit("graph-created", this.getGraph());
  }

  onChangeModelContent(e) {
    this.emit("change-value", e);
  }
}

export default Editor;
