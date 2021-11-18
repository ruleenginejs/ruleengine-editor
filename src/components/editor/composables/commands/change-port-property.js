import { createChanges, createDefinition, EditCommand } from "@/utils/edit-command";
import { notImplemented } from "@/utils/errors";

export class ChangePortProperty extends EditCommand {
  doApply(model, payload) {
    const { nodeId, portId, value } = payload;
    if (!nodeId) return null;

    const node = model.getNodeById(nodeId);
    if (!node) return null;

    const port = node.getPortById(portId);
    if (!port) return null;

    const { oldValue, newValue } = this.changeProperty(port, value);
    return this._createChanges(this.name, node.id, port.id, newValue, oldValue);
  }

  // eslint-disable-next-line no-unused-vars
  changeProperty(port, newValue) {
    notImplemented();
  }

  _createChanges(commandName, nodeId, portId, newValue, oldValue) {
    return createChanges(
      ChangePortProperty.createDef(commandName, nodeId, portId, newValue),
      ChangePortProperty.createDef(commandName, nodeId, portId, oldValue)
    );
  }

  static createDef(commandName, nodeId, portId, value) {
    return createDefinition(commandName, {
      nodeId,
      portId,
      value
    })
  }
}
