import { computed, ref, onMounted, nextTick } from 'vue';
import debounce from 'debounce';
import { SelectableModel } from './selectable-model';
import { validateLink } from './link-rules';
import { createNewConnection } from './new-connection';
import { ChangeNodePosition } from './commands/change-node-position';
import { win } from '@/utils/platform';

const WIN_ZOOM_INTENSITY = 0.3;
const DEFAULT_ZOOM_INTENSITY = 0.8;
const MAX_MOVE_INTENSITY = 0.4;

class EditorGraph {
  constructor({ model, viewport, zoom, resizeDelay, emit }) {
    this.model = model;
    this.emit = emit;
    this.canvas = ref(null);
    this.zoomIntensity = ref(win ? WIN_ZOOM_INTENSITY : DEFAULT_ZOOM_INTENSITY);
    this.moveIntensity = ref(MAX_MOVE_INTENSITY);

    this.onObjectSelected = this.onObjectSelected.bind(this);
    this.invalidateCanvasSize = this.invalidateCanvasSize.bind(this);
    this.onCreated = this.onCreated.bind(this);
    this.onChangeNodePosition = this.onChangeNodePosition.bind(this);
    this.linkRule = this.linkRule.bind(this);
    this.onNewLink = this.onNewLink.bind(this);
    this.onResize = debounce(this.invalidateCanvasSize, resizeDelay.value);

    this.initComputed({ viewport, zoom });

    onMounted(() => {
      nextTick(this.onCreated);
    });
  }

  initComputed({ viewport, zoom }) {
    this.cvViewport = computed({
      get: () => viewport.value,
      set: val => this.emit('update:viewport', val)
    });

    this.cvZoom = computed({
      get: () => zoom.value,
      set: val => this.emit('update:zoom', val)
    });
  }

  onCreated() {
    this.emit('created');
  }

  onObjectSelected(selectableModel, value) {
    if (selectableModel instanceof SelectableModel) {
      const { selectedObject } = this.model.value;
      if (selectedObject) {
        selectedObject.selected = false;
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

    if (typeof maxZoom === 'number') {
      let { center, zoom } = canvas.getBoundsCenterZoom(bounds);
      if (zoom > maxZoom) {
        zoom = maxZoom;
      }
      canvas.setCenter(center, zoom);
    } else {
      canvas.fitBounds(bounds);
    }
  }

  getCanvasInstance() {
    return this.canvas.value?.getCanvas();
  }

  onChangeNodePosition(node, e) {
    this.model.value.applyEdits([
      ChangeNodePosition.createDef(node.id, e.newPosition)
    ]);
  }

  onNewLink(e) {
    createNewConnection(this.model.value, e.from, e.to);
  }

  linkRule(from, to) {
    return validateLink(this.model.value, from, to);
  }
}

export default EditorGraph;
