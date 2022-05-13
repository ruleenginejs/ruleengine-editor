import { markRaw } from 'vue';
import localize from '@/utils/localize';
import { GraphNodeType } from './graph-node-type';
import { registerActionHandler } from './toolbar-actions';
import VIconStartNode from '../icons/v-icon-start-node.vue';
import VIconEndNode from '../icons/v-icon-end-node.vue';
import VIconErrorNode from '../icons/v-icon-error-node.vue';
import VIconSingleNode from '../icons//v-icon-single-node.vue';

const NEW_NODE_START_OFFSET = [20, 20];
const NEW_NODE_CASCADE_OFFSET = [15, 15];
const FIT_CANVAS_MAX_ZOOM = 100;
const ZOOM_DELTA = 2;
const NEW_NAV_NODE_OFFSET = [17, 17];
const NEW_NODE_OFFSET = [90, 105];
const NEW_NODE_DEFAULT_OFFSET = [0, 0];

export const defaultActionKey = Object.freeze({
  zoomIn: 'zoomIn',
  zoomOut: 'zoomOut',
  remove: 'remove',
  fitCanvas: 'fitCanvas',
  addStart: 'addStart',
  addEnd: 'addEnd',
  addError: 'addError',
  addSingle: 'addSingle',
  addComposite: 'addComposite'
});

export const defaultActionDefinitions = [
  {
    id: defaultActionKey.addStart,
    icon: markRaw(VIconStartNode),
    title: localize('editor.action.addStart'),
    label: localize('editor.action.addStart'),
    disabled: false,
    visible: true,
    draggable: true,
    order: 10
  },
  {
    id: defaultActionKey.addError,
    icon: markRaw(VIconErrorNode),
    title: localize('editor.action.addError'),
    label: localize('editor.action.addError'),
    disabled: false,
    visible: true,
    draggable: true,
    order: 30
  },
  {
    id: defaultActionKey.addSingle,
    icon: markRaw(VIconSingleNode),
    title: localize('editor.action.addSingle'),
    label: localize('editor.action.addSingle'),
    disabled: false,
    visible: true,
    draggable: true,
    order: 40
  },
  {
    id: defaultActionKey.addEnd,
    icon: markRaw(VIconEndNode),
    title: localize('editor.action.addEnd'),
    label: localize('editor.action.addEnd'),
    disabled: false,
    visible: true,
    draggable: true,
    order: 41
  },
  {
    id: defaultActionKey.fitCanvas,
    icon: 'move',
    title: localize('editor.action.fitCanvas'),
    label: localize('editor.action.fitCanvas'),
    disabled: false,
    visible: true,
    draggable: false,
    order: 50
  },
  {
    id: defaultActionKey.zoomIn,
    icon: 'zoom-in',
    title: localize('editor.action.zoomIn'),
    label: localize('editor.action.zoomIn'),
    disabled: false,
    visible: true,
    draggable: false,
    order: 60
  },
  {
    id: defaultActionKey.zoomOut,
    icon: 'zoom-out',
    title: localize('editor.action.zoomOut'),
    label: localize('editor.action.zoomOut'),
    disabled: false,
    visible: true,
    draggable: false,
    order: 70
  },
  {
    id: defaultActionKey.remove,
    icon: 'trash',
    title: localize('editor.action.remove'),
    label: localize('editor.action.remove'),
    disabled: false,
    visible: true,
    draggable: false,
    order: 80
  }
];

registerActionHandler(defaultActionKey.zoomIn, handleZoomInAction);
registerActionHandler(defaultActionKey.zoomOut, handleZoomOutAction);
registerActionHandler(defaultActionKey.fitCanvas, handleFitCanvasAction);
registerActionHandler(defaultActionKey.remove, handleRemoveAction);
registerActionHandler(defaultActionKey.addStart, handleAddTypedNode);
registerActionHandler(defaultActionKey.addEnd, handleAddTypedNode);
registerActionHandler(defaultActionKey.addError, handleAddTypedNode);
registerActionHandler(defaultActionKey.addSingle, handleAddTypedNode);

function handleZoomInAction(editorInstance) {
  editorInstance.setZoom(Math.ceil(editorInstance.getZoom() * ZOOM_DELTA));
}

function handleZoomOutAction(editorInstance) {
  editorInstance.setZoom(Math.ceil(editorInstance.getZoom() / ZOOM_DELTA));
}

function handleFitCanvasAction(editorInstance) {
  editorInstance.fitCanvas(FIT_CANVAS_MAX_ZOOM);
}

function handleRemoveAction(editorInstance) {
  editorInstance.deleteSelectedObject(true);
}

function handleAddTypedNode(editorInstance, actionId, args = null) {
  const { type, name, offset } = getNodeOptionsFromAction(actionId);
  if (!type) return;

  const isDragged = args?.event && args?.isClick === false;
  if (isDragged) {
    const mousePoint = {
      x: args.event.clientX ?? 0,
      y: args.event.clientY ?? 0
    };
    const offsetPoint = {
      x: offset[0],
      y: offset[1]
    };
    editorInstance.newNodeInCurrentViewByMousePosition(
      type,
      mousePoint,
      offsetPoint,
      { name },
      true
    );
  } else {
    editorInstance.newNodeInCurrentViewWithCascade(
      type,
      NEW_NODE_START_OFFSET,
      NEW_NODE_CASCADE_OFFSET,
      { name },
      true
    );
  }
}

function getNodeOptionsFromAction(actionId) {
  let type = null;
  let name = null;
  let offset = NEW_NODE_DEFAULT_OFFSET;

  switch (actionId) {
    case defaultActionKey.addStart:
      type = GraphNodeType.Start;
      offset = NEW_NAV_NODE_OFFSET;
      break;
    case defaultActionKey.addEnd:
      type = GraphNodeType.End;
      offset = NEW_NAV_NODE_OFFSET;
      break;
    case defaultActionKey.addError:
      type = GraphNodeType.Error;
      offset = NEW_NAV_NODE_OFFSET;
      break;
    case defaultActionKey.addSingle:
      type = GraphNodeType.Single;
      name = localize('editor.action.newNode');
      offset = NEW_NODE_OFFSET;
      break;
    case defaultActionKey.addComposite:
      type = GraphNodeType.Composite;
      name = localize('editor.action.newNode');
      offset = NEW_NODE_OFFSET;
      break;
  }

  return { type, name, offset };
}
