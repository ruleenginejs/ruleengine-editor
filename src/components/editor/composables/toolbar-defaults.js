import localize from "@/utils/localize";
import { GraphNodeType } from "./graph-node-type";
import { registerActionHandler } from "./toolbar-actions";

const NEW_STEP_START_OFFSET = [20, 20];
const NEW_STEP_CASCADE_OFFSET = [15, 15];
const FIT_CANVAS_MAX_ZOOM = 100;
const ZOOM_DELTA = 2;

export const defaultActionKey = Object.freeze({
  zoomIn: "zoomIn",
  zoomOut: "zoomOut",
  remove: "remove",
  fitCanvas: "fitCanvas",
  addStart: "addStart",
  addEnd: "addEnd",
  addError: "addError",
  addSingle: "addSingle",
  addComposite: "addComposite"
});

export const defaultActionDefinitions = [
  {
    id: defaultActionKey.addStart,
    icon: "star",
    title: localize("editor.action.addStart"),
    label: localize("editor.action.addStart"),
    disabled: false,
    visible: true,
    draggable: true,
    order: 10
  },
  {
    id: defaultActionKey.addEnd,
    icon: "star",
    title: localize("editor.action.addEnd"),
    label: localize("editor.action.addEnd"),
    disabled: false,
    visible: true,
    draggable: true,
    order: 20
  },
  {
    id: defaultActionKey.addError,
    icon: "star",
    title: localize("editor.action.addError"),
    label: localize("editor.action.addError"),
    disabled: false,
    visible: true,
    draggable: true,
    order: 30
  },
  {
    id: defaultActionKey.addSingle,
    icon: "add",
    title: localize("editor.action.addSingle"),
    label: localize("editor.action.addSingle"),
    disabled: false,
    visible: true,
    draggable: true,
    order: 40
  },
  {
    id: defaultActionKey.fitCanvas,
    icon: "move",
    title: localize("editor.action.fitCanvas"),
    label: localize("editor.action.fitCanvas"),
    disabled: false,
    visible: true,
    draggable: false,
    order: 50
  },
  {
    id: defaultActionKey.zoomIn,
    icon: "zoom-in",
    title: localize("editor.action.zoomIn"),
    label: localize("editor.action.zoomIn"),
    disabled: false,
    visible: true,
    draggable: false,
    order: 60
  },
  {
    id: defaultActionKey.zoomOut,
    icon: "zoom-out",
    title: localize("editor.action.zoomOut"),
    label: localize("editor.action.zoomOut"),
    disabled: false,
    visible: true,
    draggable: false,
    order: 70
  },
  {
    id: defaultActionKey.remove,
    icon: "trash",
    title: localize("editor.action.remove"),
    label: localize("editor.action.remove"),
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
registerActionHandler(defaultActionKey.addStart, handleAddTypedStep);
registerActionHandler(defaultActionKey.addEnd, handleAddTypedStep);
registerActionHandler(defaultActionKey.addError, handleAddTypedStep);
registerActionHandler(defaultActionKey.addSingle, handleAddTypedStep);

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

function handleAddTypedStep(editorInstance, actionId, args = null) {
  const { type, name } = getStepTypeAndNameFromAction(actionId);
  if (!type) return;

  const isDragged = args?.event && args?.isClick === false;
  if (isDragged) {
    const mousePoint = {
      x: (args.event.clientX ?? 0),
      y: (args.event.clientY ?? 0)
    }
    editorInstance.newNodeInCurrentViewMousePosition(
      type,
      mousePoint,
      { name },
      true
    );
  } else {
    editorInstance.newNodeInCurrentViewWithCascade(
      type,
      NEW_STEP_START_OFFSET,
      NEW_STEP_CASCADE_OFFSET,
      { name },
      true
    );
  }
}

function getStepTypeAndNameFromAction(actionId) {
  let type = null;
  let name = null;

  switch (actionId) {
    case defaultActionKey.addStart:
      type = GraphNodeType.Start;
      break;
    case defaultActionKey.addEnd:
      type = GraphNodeType.End;
      break;
    case defaultActionKey.addError:
      type = GraphNodeType.Error;
      break;
    case defaultActionKey.addSingle:
      type = GraphNodeType.Single;
      name = localize("editor.action.newNode");
      break;
    case defaultActionKey.addComposite:
      type = GraphNodeType.Composite;
      name = localize("editor.action.newNode");
      break;
  }

  return { type, name };
}
