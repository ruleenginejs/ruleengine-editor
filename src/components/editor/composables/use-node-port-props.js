import { computed } from "vue";
import { ChangePortDisabled } from "./commands/change-port-disabled";
import { ChangePortName } from "./commands/change-port-name";
import { CreatePort } from "./commands/create-port";
import { DeleteConnectionByPort } from "./commands/delete-connection-by-port";
import { DeletePort } from "./commands/delete-port";
import { createEditHandler } from "./edit-handler";
import { GraphPortType } from "./graph-port-type";

export default function useNodePortProps({ nodeModel, emit, editDelay }) {
  const portEditDisabled = computed(() => nodeModel.value.isNavNode);
  const inPorts = computed(() => filterByType(nodeModel.value.ports, GraphPortType.IN));
  const outPorts = computed(() => filterByType(nodeModel.value.ports, GraphPortType.OUT));
  const _editNameHandlers = {};

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

  function onUpdatePortName(port, newValue) {
    getEditNameHandlerForPort(port.id)(port.nodeId, port.id, newValue);
  }

  function onUpdatePortDisabled(port, newValue) {
    editDisabledHandler(port.nodeId, port.id, newValue);
  }

  function onPortAdd(portType) {
    const nodeId = nodeModel.value.id;
    createPortHandler(nodeId, portType, null, false);
  }

  function onPortRemove(port) {
    removePortHandler(port);
  }

  function filterByType(portArray, portType) {
    return portArray.filter(p => p.portType === portType);
  }

  function createEditPropertyHandler(commandCtor, withDelay = false) {
    return createEditHandler(
      (nodeId, portId, val) => commandCtor.createDef(nodeId, portId, val),
      emit,
      withDelay ? editDelay.value : null
    )
  }

  function getEditNameHandlerForPort(portId) {
    if (!_editNameHandlers[portId]) {
      _editNameHandlers[portId] = createEditPropertyHandler(ChangePortName, true);
    }
    return _editNameHandlers[portId];
  }

  return {
    inPorts,
    outPorts,
    portEditDisabled,
    onUpdatePortName,
    onUpdatePortDisabled,
    onPortRemove,
    onPortAdd
  }
}
