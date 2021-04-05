import { computed, ref } from "vue";
import { GraphNodeType } from "./graph-node-type";
import { SelectableModel } from "./selectable-model";
import debounce from "debounce";

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

    this.onObjectSelected = this.onObjectSelected.bind(this);
    this.selectedObject = ref(null);

    this.onResize = debounce(() => {
      this.invalidateCanvasSize();
    }, resizeDelay.value);

    this.nodeLinkRule = this.nodeLinkRule.bind(this);
    this.portLinkRule = this.portLinkRule.bind(this);

    this.onObjectSelected(model.value, true);
  }

  unselectObject() {
    if (this.selectedObject.value instanceof SelectableModel) {
      this.selectedObject.value.selected = false;
      this.selectedObject.value = null;
    }
  }

  onObjectSelected(selectableModel, value) {
    if (selectableModel instanceof SelectableModel) {
      if (value) {
        this.unselectObject();
        this.selectedObject.value = selectableModel;
      }
      selectableModel.selected = value;
    }
  }

  invalidateCanvasSize() {
    this.canvas.value?.getCanvas().invalidateSize();
  }

  nodeLinkRule() {
    debugger;
  }

  portLinkRule() {
    debugger;
  }
}

export default EditorGraph;
