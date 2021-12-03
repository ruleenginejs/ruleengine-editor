import { ref, watch, watchEffect } from "vue";
import { EditorOperations } from "./editor-operations";
import { createModel } from "./graph-model";

class Editor {
  constructor({
    value,
    provider,
    editable,
    viewport,
    zoom,
    autoFit,
    keyboard,
    emit
  }) {
    this.model = ref(createModel(value.value));
    this.provider = provider;
    this.editable = editable;
    this.emit = emit;
    this.autoFit = autoFit;
    this.keyboard = keyboard;
    this.graph = ref(null);
    this.viewportModel = ref(viewport.value);
    this.zoomModel = ref(zoom.value);
    this.operations = new EditorOperations(this.model);
    this.container = ref(null);
    this.focused = ref(false);

    this.onResize = this.onResize.bind(this);
    this.onGraphCreated = this.onGraphCreated.bind(this);
    this.onChangeModelContent = this.onChangeModelContent.bind(this);
    this.onFocusIn = this.onFocusIn.bind(this);
    this.onFocusOut = this.onFocusOut.bind(this);
    this.onKeyboardDeleteKey = this.onKeyboardDeleteKey.bind(this);

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

    watchEffect(() => { this.focusWhenChangeSelection(); });
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

  newNode(type, nodeData, notify) {
    this.operations.createNode(type, nodeData, notify);
  }

  newNodeInCurrentViewWithOffset(type, positionOffset, nodeData, notify) {
    this.operations.createNodeInCurrentViewWithOffset(
      type,
      this.getViewport(),
      positionOffset,
      nodeData,
      notify
    );
  }

  newNodeInCurrentViewWithCascade(type, startOffset, cascadeOffset, nodeData, notify) {
    this.operations.createNodeInCurrentViewWithCascade(
      type,
      this.getViewport(),
      startOffset,
      cascadeOffset,
      nodeData,
      notify
    );
  }

  newNodeInCurrentViewMousePosition(type, mousePoint, nodeData, notify) {
    const canvasInstance = this.getGraph()?.getCanvasInstance();
    if (canvasInstance) {
      this.operations.newNodeInCurrentViewMousePosition(
        canvasInstance,
        type,
        mousePoint,
        nodeData,
        notify
      );
    }
  }

  deleteSelectedObject(notify) {
    this.deleteModelObject(this.getSelectedObject(), notify);
  }

  deleteModelObject(modelObject, notify) {
    this.operations.deleteModelObject(modelObject, notify);
  }

  getSelectedObject() {
    return this.model.value.selectedObject;
  }

  focusWhenChangeSelection() {
    const selectedObject = this.model.value.selectedObject;
    if (this.keyboard.value && selectedObject) {
      this.container.value?.focus();
    }
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

  onFocusIn() {
    this.focused.value = true;
  }

  onFocusOut() {
    this.focused.value = false;
  }

  onKeyboardDeleteKey() {
    this.deleteSelectedObject(true);
  }
}

export default Editor;
