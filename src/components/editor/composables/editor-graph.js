import { computed, ref, onMounted, nextTick } from "vue";
import { GraphNodeType } from "./graph-node-type";
import { SelectableModel } from "./selectable-model";
import debounce from "debounce";
import { ChangeNodePosition } from "./commands";

class EditorGraph {
  constructor({
    model,
    viewport,
    zoom,
    resizeDelay,
    emit
  }) {
    this.model = model;
    this.emit = emit;
    this.canvas = ref(null);

    this.linkRule = this.linkRule.bind(this);
    this.onObjectSelected = this.onObjectSelected.bind(this);
    this.invalidateCanvasSize = this.invalidateCanvasSize.bind(this);
    this.onCreated = this.onCreated.bind(this);
    this.onChangeNodePosition = this.onChangeNodePosition.bind(this);
    this.onResize = debounce(this.invalidateCanvasSize, resizeDelay.value);

    this.initComputed({ viewport, zoom, model });

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

    this.circleNodes = computed(() => {
      return model.value.getNodesByType(
        GraphNodeType.Start,
        GraphNodeType.End,
        GraphNodeType.Error
      );
    });

    this.stepNodes = computed(() => {
      return model.value.getNodesByType(GraphNodeType.Single);
    });
  }

  onCreated() {
    this.emit("created");
  }

  onObjectSelected(selectableModel, value) {
    if (selectableModel instanceof SelectableModel) {
      const { selectedObject } = this.model.value;
      if (selectedObject) {
        selectedObject.selected = false
      }
      selectableModel.selected = value;
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

  onChangeNodePosition(node, e) {
    this.model.value.applyEdits([
      ChangeNodePosition.createRaw(node.id, e.newPosition)
    ]);
  }

  linkRule() {
  }
}

export default EditorGraph;
