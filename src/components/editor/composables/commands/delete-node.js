import { createChanges, createDefinition, EditCommand } from "@/utils/edit-command";
import { CreateNode } from "./create-node";

export class DeleteNode extends EditCommand {
  static NAME = "delete-node";

  constructor(payload) {
    super(DeleteNode.NAME, payload);
  }

  doApply(model, payload) {
    const { nodeId } = payload;

    if (!nodeId) {
      return null;
    }

    const node = model.getNodeById(nodeId);
    if (!node) return null;

    model.deleteNode(node);
    return this._createChanges(node);
  }

  _createChanges(node) {
    return createChanges(
      DeleteNode.createDef(node.id),
      CreateNode.createDef(node.toJSON())
    )
  }

  static createDef(nodeId) {
    return createDefinition(DeleteNode.NAME, { nodeId })
  }
}
