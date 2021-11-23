import { computed, ref, reactive } from "vue";
import localize from "@/utils/localize";
import { getNodeTypeName, GraphNodeType } from "./graph-node-type";
import { ChangeNodeName } from "./commands/change-node-name";
import { ChangeNodeHandlerFile } from "./commands/change-node-handler-file";
import { createEditHandler } from "./edit-handler";
import { getColorPreset, isColorFromPreset } from "./graph-node-color";
import { ucFirst } from "@/utils/strings";
import { ChangeNodeColor } from "./commands/change-node-color";

const EMPTY_STRING = "";

export default function useNodeProps({ nodeModel, emit, editDelay }) {
  const sectionName = computed(() => {
    return localize("editor.sidebar.nodeSection", getNodeTypeName(nodeModel.value.nodeType));
  });

  const useCustomColor = ref(false);
  const colorOptions = reactive(getColorOptions());

  const canShowName = computed(() => !nodeModel.value.isNavNode);
  const canShowHandler = computed(() => nodeModel.value.nodeType === GraphNodeType.Single);
  const canShowColor = computed(() => !nodeModel.value.isNavNode);
  const canShowPorts = ref(true);
  const canShowConnections = ref(true);
  const canShowUserProps = ref(true);

  const editNameHandler = createHandler(ChangeNodeName, true);
  const editFileHandler = createHandler(ChangeNodeHandlerFile, true);
  const editColorHandler = createHandler(ChangeNodeColor, false);
  const delayEditColorHandler = createHandler(ChangeNodeColor, true);

  const editName = computed({
    get: () => nodeModel.value.name,
    set: (val) => { editNameHandler(val); }
  });

  const editHandlerFile = computed({
    get: () => nodeModel.value.handlerFile,
    set: (val) => { editFileHandler(val); }
  });

  const editColor = computed({
    get: () => nodeModel.value.headerColor ?? EMPTY_STRING,
    set: (val) => {
      if (useCustomColor.value) {
        delayEditColorHandler(val);
      } else {
        editColorHandler(val);
      }
    }
  });

  const editUseCustomColor = computed({
    get: () => useCustomColor.value,
    set: (val) => {
      useCustomColor.value = val;
      if (!val && isCustomHeaderColor()) {
        const { headerColor } = nodeModel.value;
        pushUniqueColorOption({
          text: headerColor,
          value: headerColor
        });
      }
    }
  });

  function createHandler(commandCtor, withDelay = false) {
    return createEditHandler(
      (val) => commandCtor.createDef(nodeModel.value.id, val),
      emit, withDelay ? editDelay.value : null)
  }

  function isCustomHeaderColor() {
    const { headerColor } = nodeModel.value;
    return headerColor && !isColorFromPreset(headerColor)
  }

  function getColorOptions() {
    const result = [
      {
        text: localize("editor.default"),
        value: EMPTY_STRING
      },
      ...getColorPreset().map(value => ({
        text: ucFirst(value),
        value
      }))
    ];
    if (isCustomHeaderColor()) {
      const { headerColor } = nodeModel.value;
      result.push({
        text: headerColor,
        value: headerColor
      })
    }
    return result;
  }

  function pushUniqueColorOption(option) {
    const optionExists = colorOptions.find(({ value }) => value === option.value);
    if (!optionExists) {
      colorOptions.push(option);
    }
  }

  function genElementId(ns, key) {
    return `v-${ns}_${key}_${nodeModel.value.id}`;
  }

  return {
    sectionName,
    editName,
    editHandlerFile,
    editColor,
    editUseCustomColor,
    canShowName,
    canShowHandler,
    canShowPorts,
    canShowConnections,
    canShowUserProps,
    canShowColor,
    useCustomColor,
    colorOptions,
    genElementId
  }
}
