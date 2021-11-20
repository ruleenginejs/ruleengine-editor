import { createChanges, createDefinition, EditCommand } from "@/utils/edit-command";
import { notImplemented } from "@/utils/errors";

export class ChangeNodeProperty extends EditCommand {
  doApply(model, payload) {
    const { nodeId, value } = payload;
    if (!nodeId) return null;

    const node = model.getNodeById(nodeId);
    if (!node) return null;

    const { oldValue, newValue } = this.changeProperty(node, value);
    return this._createChanges(this.name, node.id, newValue, oldValue);
  }

  // eslint-disable-next-line no-unused-vars
  changeProperty(node, newValue) {
    notImplemented();
  }

  _createChanges(commandName, nodeId, newValue, oldValue) {
    return createChanges(
      ChangeNodeProperty.createDef(commandName, nodeId, newValue),
      ChangeNodeProperty.createDef(commandName, nodeId, oldValue)
    );
  }

  static createDef(commandName, nodeId, value) {
    return createDefinition(commandName, {
      nodeId,
      value
    })
  }
}
