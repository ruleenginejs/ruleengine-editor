import { computed, ref, reactive } from "vue";
import localize from "@/utils/localize";
import { createEditHandler } from "./edit-handler";
import { ChangePortName } from "./commands/change-port-name";
import { ChangePortDisabled } from "./commands/change-port-disabled";
import { DEFAULT_PORT, ERROR_PORT } from "./graph-port-model";
import { GraphPortType } from "./graph-port-type";

export default function usePortProps({ portModel, emit, editDelay }) {
  const sectionName = ref(localize("editor.sidebar.portSection"));
  const portName = ref(portModel.value.name);
  const validation = reactive({ error: false, message: null });
  const siblingPortNames = computed(() => portModel.value.siblingPorts.map(p => p.name));

  const editNameHandler = createHandler(ChangePortName, true);
  const editDisabledHandler = createHandler(ChangePortDisabled);
  const editIsErrorHandler = createHandler(ChangePortName);

  const editName = computed({
    get: () => portName.value,
    set: (val) => {
      portName.value = val;
      if (validatePortName(val)) {
        editNameHandler(val);
      }
    }
  });

  const editDisabled = computed({
    get: () => portModel.value.disabled,
    set: (val) => { editDisabledHandler(val); }
  });

  const canEditError = computed(() =>
    portModel.value.portType === GraphPortType.OUT);

  const editIsError = computed({
    get: () => portModel.value.isErrorPort,
    set: (val) => {
      if (canEditError.value) {
        editIsErrorHandler(val ? ERROR_PORT : DEFAULT_PORT);
      }
    }
  });

  function createHandler(commandCtor, withDelay = false) {
    return createEditHandler(
      (val) => commandCtor.createDef(
        portModel.value.nodeId,
        portModel.value.id,
        val
      ),
      emit, withDelay ? editDelay.value : null)
  }

  function validatePortName(value) {
    let isValid = true;
    if (isValid && !value) {
      isValid = false;
      validation.error = true;
      validation.message = localize("editor.error.portEmpty");
    }
    if (isValid && siblingPortNames.value.indexOf(value) !== -1) {
      isValid = false;
      validation.error = true;
      validation.message = localize("editor.error.portExists", value);
    }
    if (isValid) {
      resetValidation();
    }
    return isValid;
  }

  function resetValidation() {
    validation.error = false;
    validation.message = null;
  }

  function checkboxId(key) {
    return `v-checkbox_${key}_${portModel.value.id}`;
  }

  return {
    sectionName,
    editName,
    editDisabled,
    editIsError,
    canEditError,
    validation,
    checkboxId
  }
}
