import localize from "@/utils/localize";
import { registerActionHandler } from "./toolbar-actions";

const defaultActions = Object.freeze({
  zoomIn: "zoomIn",
  zoomOut: "zoomOut"
});

export const defaultActionDefinitions = [
  {
    id: defaultActions.zoomIn,
    icon: "zoom-in",
    title: localize("editor.action.zoomIn"),
    label: localize("editor.action.zoomIn"),
    disabled: false,
    visible: true
  },
  {
    id: defaultActions.zoomOut,
    icon: "zoom-out",
    title: localize("editor.action.zoomOut"),
    label: localize("editor.action.zoomOut"),
    disabled: false,
    visible: true
  }
];

registerActionHandler(defaultActions.zoomIn, handleZoomInAction);
registerActionHandler(defaultActions.zoomOut, handleZoomOutAction);

function handleZoomInAction(editorInstance) {
  editorInstance.setZoom(Math.ceil(editorInstance.getZoom() * 2));
}

function handleZoomOutAction(editorInstance) {
  editorInstance.setZoom(Math.ceil(editorInstance.getZoom() / 2));
}
