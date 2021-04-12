import { createChanges, createDefinition, EditCommand } from "@/utils/edit-command";
import { CreateNode } from "./create-node";

export class DeleteNode extends EditCommand {
  static NAME = "delete-node";

  constructor(payload) {
    super(DeleteNode.NAME, payload);
  }

  doApply(model, payload) {
    if (!payload.nodeId) return null;
    const node = model.getNodeById(payload.nodeId);
    if (!node) return;

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
