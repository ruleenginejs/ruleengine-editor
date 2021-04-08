import { computed, ref, watch } from "vue";
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
    this.selectedObject = ref(this.model.value);

    this.onSplitViewResize = this.onSplitViewResize.bind(this);
    this.onSplitViewCreated = this.onSplitViewCreated.bind(this);
    this.onGraphCreated = this.onGraphCreated.bind(this);
    this.onChangeModelContent = this.onChangeModelContent.bind(this);

    this.model.value.addChangeListener(this.onChangeModelContent);

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
    if (this.model.value) {
      this.model.value.destroy();
    }

    this.model.value = createModel(value);
    this.model.value.addChangeListener(this.onChangeModelContent);

    this.selectedObject.value = this.model.value;
  }

  getModel() {
    return this.model.value;
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
