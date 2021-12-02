import { computed, reactive, watch } from "vue";
import { ChangePortDisabled } from "./commands/change-port-disabled";
import { ChangePortName } from "./commands/change-port-name";
import { CreatePort } from "./commands/create-port";
import { DeleteConnectionByPort } from "./commands/delete-connection-by-port";
import { DeletePort } from "./commands/delete-port";
import { createEditHandler } from "./edit-handler";
import { GraphPortType } from "./graph-port-type";
import localize from "@/utils/localize";

export default function useNodePortProps({ nodeModel, emit, editDelay }) {
  const _editNameHandlers = {};
  const canEditPort = computed(() => !nodeModel.value.isNavNode);

  const ports = reactive(nodeModel.value.ports.map(toEditPortModel));
  const inPorts = computed(() => ports.filter(p => p.portType === GraphPortType.IN));
  const outPorts = computed(() => ports.filter(p => p.portType === GraphPortType.OUT));

  const editDisabledHandler = createEditPropertyHandler(ChangePortDisabled);
  const removePortHandler = createEditHandler(
    (port) => [
      DeleteConnectionByPort.createDef(port.nodeId, port.id),
      DeletePort.createDef(port.nodeId, port.id)
    ],
    emit
  );
  const createPortHandler = createEditHandler((nodeId, portType, name, disabled) =>
    CreatePort.createDef(nodeId, portType, name, disabled),
    emit
  );

  watch(nodeModel, (newValue, oldValue) => {
    if (newValue.ports.length !== oldValue.ports.length) {
      ports.length = 0;
      ports.push.apply(ports, newValue.ports.map(toEditPortModel));
    }
  });

  function onUpdatePortName(port, newValue) {
    port.name = newValue;
    if (port.validateName(newValue)) {
      getEditNameHandler(port.id)(port.nodeId, port.id, newValue);
    }
  }

  function onUpdatePortDisabled(port, newValue) {
    port.disabled = newValue;
    editDisabledHandler(port.nodeId, port.id, newValue);
  }

  function onPortAdd(portType) {
    const nodeId = nodeModel.value.id;
    createPortHandler(nodeId, portType, null, false);
  }

  function onPortRemove(port) {
    removePortHandler(port);
  }

  function toEditPortModel(portModel) {
    return {
      ...portModel,
      validation: reactive({
        error: false,
        message: null
      }),
      validateName(value) {
        let isValid = true;
        if (isValid && !value) {
          isValid = false;
          this.validation.error = true;
          this.validation.message = localize("editor.error.portEmpty");
        }
        if (isValid && checkPortExists(this.id, this.portType, value)) {
          isValid = false;
          this.validation.error = true;
          this.validation.message = localize("editor.error.portExists", value);
        }
        if (isValid) {
          this.resetValidation();
        }
        return isValid;
      },
      resetValidation() {
        this.validation.error = false;
        this.validation.message = null;
      }
    }
  }

  function createEditPropertyHandler(commandCtor, withDelay = false) {
    return createEditHandler(
      (nodeId, portId, val) => commandCtor.createDef(nodeId, portId, val),
      emit,
      withDelay ? editDelay.value : null
    )
  }

  function getEditNameHandler(portId) {
    if (!_editNameHandlers[portId]) {
      _editNameHandlers[portId] = createEditPropertyHandler(ChangePortName, true);
    }
    return _editNameHandlers[portId];
  }

  function checkPortExists(excludePortId, portType, name) {
    for (let i = 0, c = ports.length; i < c; i++) {
      const port = ports[i];
      if (port.id !== excludePortId
        && port.portType === portType
        && port.name === name) {
        return true;
      }
    }
    return false;
  }

  return {
    inPorts,
    outPorts,
    canEditPort,
    onUpdatePortName,
    onUpdatePortDisabled,
    onPortRemove,
    onPortAdd
  }
}
