import { createChanges, createDefinition, EditCommand } from "@/utils/edit-command";

export class ChangePortName extends EditCommand {
  static NAME = "change-port-name";

  constructor(payload) {
    super(ChangePortName.NAME, payload);
  }

  doApply(model, payload) {
    const { nodeId, portId, value } = payload;
    if (!nodeId) return null;

    const node = model.getNodeById(nodeId);
    if (!node) return null;

    const port = node.getPortById(portId);
    if (!port) return null;

    const { oldValue, newValue } = port.changeName(value);
    return this._createChanges(node.id, port.id, newValue, oldValue);
  }

  _createChanges(nodeId, portId, newValue, oldValue) {
    return createChanges(
      ChangePortName.createDef(nodeId, portId, newValue),
      ChangePortName.createDef(nodeId, portId, oldValue)
    );
  }

  static createDef(nodeId, portId, value) {
    return createDefinition(ChangePortName.NAME, {
      nodeId,
      portId,
      value
    })
  }
}
