import { computed, ref } from "vue";
import debounce from "debounce";
import localize from "@/utils/localize";
import { GraphNodeType } from "./graph-node-type";
import { isDefined } from "@/utils/types";
import { ChangeNodeName } from "./commands/change-node-name";
import { ChangeNodeHandlerFile } from "./commands/change-node-handler-file";

function createHandler(func, delay = null) {
  if (!isDefined(delay)) {
    return func;
  } else {
    return debounce(func, delay);
  }
}

export default function useNodeProps({ nodeModel, emit, editDelay }) {
  const sectionName = computed(() => {
    return localize("editor.sidebar.nodeTitle", nodeModel.value.getTypeName());
  });

  const canShowName = computed(() => !nodeModel.value.isNavNode);
  const canShowHandler = computed(() => nodeModel.value.type === GraphNodeType.Single);
  const canShowPorts = ref(false);
  const canShowConnections = ref(false);
  const canShowUserProps = ref(false);

  const notifyEdit = (editCommand) => {
    emit("edit", [editCommand]);
  }

  const editNameHandler = createEditHandler(
    (val) => ChangeNodeName.createDef(nodeModel.value.id, val));

  const editFileHandler = createEditHandler(
    (val) => ChangeNodeHandlerFile.createDef(nodeModel.value.id, val));

  const editName = computed({
    get: () => nodeModel.value.name,
    set: (val) => { editNameHandler(val); }
  });

  const editHandlerFile = computed({
    get: () => nodeModel.value.handlerFile,
    set: (val) => { editFileHandler(val); }
  });

  function createEditHandler(func) {
    return createHandler((val) => notifyEdit(func(val)), editDelay.value);
  }

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
