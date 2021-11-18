import { createChanges, createDefinition, EditCommand } from "@/utils/edit-command";
import { notImplemented } from "@/utils/errors";

export class ChangeNodeValue extends EditCommand {
  doApply(model, payload) {
    const { nodeId, value } = payload;
    if (!nodeId) return null;

    const node = model.getNodeById(nodeId);
    if (!node) return null;

    const oldValue = this.changeValue(node, value);
    const newValue = this.getNewValue(node);

    return this._createChanges(this.name, node.id, newValue, oldValue);
  }

  // eslint-disable-next-line no-unused-vars
  changeValue(node, value) {
    notImplemented();
  }

  // eslint-disable-next-line no-unused-vars
  getNewValue(node) {
    notImplemented();
  }

  _createChanges(commandName, nodeId, newValue, oldValue) {
    return createChanges(
      ChangeNodeValue.createDef(commandName, nodeId, newValue),
      ChangeNodeValue.createDef(commandName, nodeId, oldValue)
    );
  }

  static createDef(commandName, nodeId, value) {
    return createDefinition(commandName, {
      nodeId,
      value
    })
  }
}
