import { computed, ref, watch, onMounted, nextTick } from "vue";
import { GraphNodeType } from "./graph-node-type";
import { SelectableModel } from "./selectable-model";
import debounce from "debounce";

class EditorGraph {
  constructor({
    model,
    viewport,
    zoom,
    resizeDelay,
    selectedObject,
    emit
  }) {
    this.model = model;
    this.emit = emit;
    this.canvas = ref(null);

    this.linkRule = this.linkRule.bind(this);
    this.onObjectSelected = this.onObjectSelected.bind(this);
    this.invalidateCanvasSize = this.invalidateCanvasSize.bind(this);
    this.onCreated = this.onCreated.bind(this);
    this.onResize = debounce(this.invalidateCanvasSize, resizeDelay.value);

    this.initComputed({ viewport, zoom, model });
    this.initWatchers({ selectedObject });

    onMounted(() => {
      nextTick(this.onCreated);
    });
  }

  initComputed({ viewport, zoom, model }) {
    this.cvViewport = computed({
      get: () => viewport.value,
      set: (val) => this.emit("update:viewport", val)
    });

    this.cvZoom = computed({
      get: () => zoom.value,
      set: (val) => this.emit("update:zoom", val)
    });

    this.circleNodes = computed(() => model.value.getNodesByType(
      GraphNodeType.Start,
      GraphNodeType.End,
      GraphNodeType.Error
    ));

    this.stepNodes = computed(() => {
      return model.value.getNodesByType(GraphNodeType.Single);
    });
  }

  initWatchers({ selectedObject }) {
    watch(selectedObject, (newValue, oldValue) => {
      if (oldValue instanceof SelectableModel) {
        oldValue.selected = false;
      }
      if (newValue instanceof SelectableModel) {
        newValue.selected = true;
      }
    });

    if (selectedObject.value instanceof SelectableModel) {
      selectedObject.value.selected = true;
    }
  }

  onCreated() {
    this.emit("created", this);
  }

  onObjectSelected(selectableModel, value) {
    if (selectableModel instanceof SelectableModel) {
      if (value) {
        this.emit("update:selectedObject", selectableModel);
      } else {
        selectableModel.selected = false;
      }
    }
  }

  invalidateCanvasSize() {
    this.canvas.value?.getCanvas().invalidateSize();
  }

  fitCanvas(maxZoom = null) {
    const canvas = this.canvas.value?.getCanvas();
    const bounds = canvas?.getNodeBounds();
    if (bounds) {
      this.fitBounds(bounds, maxZoom);
    }
  }

  fitBounds(bounds, maxZoom = null) {
    const canvas = this.canvas.value?.getCanvas();
    if (!canvas && !bounds) return;

    if (typeof maxZoom === "number") {
      let { center, zoom } = canvas.getBoundsCenterZoom(bounds);
      if (zoom > maxZoom) {
        zoom = maxZoom;
      }
      canvas.setCenter(center, zoom);
    } else {
      canvas.fitBounds(bounds);
    }
  }

  linkRule() {
  }
}

export default EditorGraph;
