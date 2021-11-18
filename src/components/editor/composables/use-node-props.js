import { computed, ref } from "vue";
import localize from "@/utils/localize";
import { getNodeTypeName, GraphNodeType } from "./graph-node-type";
import { ChangeNodeName } from "./commands/change-node-name";
import { ChangeNodeHandlerFile } from "./commands/change-node-handler-file";
import { createEditHandler } from "./edit-handler";

export default function useNodeProps({ nodeModel, emit, editDelay }) {
  const sectionName = computed(() => {
    return localize("editor.sidebar.nodeSection", getNodeTypeName(nodeModel.value.nodeType));
  });

  const canShowName = computed(() => !nodeModel.value.isNavNode);
  const canShowHandler = computed(() => nodeModel.value.nodeType === GraphNodeType.Single);
  const canShowPorts = ref(false);
  const canShowConnections = ref(false);
  const canShowUserProps = ref(false);

  const editNameHandler = createEditHandler(
    (val) => ChangeNodeName.createDef(nodeModel.value.id, val), emit, editDelay.value);

  const editFileHandler = createEditHandler(
    (val) => ChangeNodeHandlerFile.createDef(nodeModel.value.id, val), emit, editDelay.value);

  const editName = computed({
    get: () => nodeModel.value.name,
    set: (val) => { editNameHandler(val); }
  });

  const editHandlerFile = computed({
    get: () => nodeModel.value.handlerFile,
    set: (val) => { editFileHandler(val); }
  });

  return {
    sectionName,
    editName,
    editHandlerFile,
    canShowName,
    canShowHandler,
    canShowPorts,
    canShowConnections,
    canShowUserProps,
    localize
  }
}
