import { computed, ref } from "vue";
import localize from "@/utils/localize";
import { createEditHandler } from "./edit-handler";
import { ChangePortName } from "./commands/change-port-name";
import { ChangePortDisabled } from "./commands/change-port-disabled";
import { DEFAULT_PORT, ERROR_PORT } from "./graph-port-model";

export default function usePortProps({ portModel, emit, editDelay }) {
  const sectionName = ref(localize("editor.sidebar.portSection"));

  function createHandler(commandCtor, withDelay = false) {
    return createEditHandler(
      (val) => commandCtor.createDef(
        portModel.value.nodeId,
        portModel.value.id,
        val
      ),
      emit, withDelay ? editDelay.value : null)
  }

  const editNameHandler = createHandler(ChangePortName, true);
  const editDisabledHandler = createHandler(ChangePortDisabled);

  const editName = computed({
    get: () => portModel.value.name,
    set: (val) => { editNameHandler(val); }
  });

  const editDisabled = computed({
    get: () => portModel.value.disabled,
    set: (val) => { editDisabledHandler(val); }
  });

  const editIsError = computed({
    get: () => portModel.value.isErrorPort,
    set: (val) => { editNameHandler(val ? ERROR_PORT : DEFAULT_PORT); }
  });

  const checkboxId = (key) => `v-checkbox_${key}_${portModel.value.id}`;

  return {
    sectionName,
    editName,
    editDisabled,
    editIsError,
    checkboxId
  }
}
