import { createChanges, createDefinition, EditCommand } from "@/utils/edit-command";

export class ChangeNodePosition extends EditCommand {
  static NAME = "change-node-position";

  constructor(payload) {
    super(ChangeNodePosition.NAME, payload);
  }

  doApply(model, payload) {
    const { nodeId, position } = payload;
    if (!nodeId || !Array.isArray(position)) return null;

    const node = model.getNodeById(nodeId);
    if (!node) return null;

    const oldPosition = node.changePosition(position);
    const newPosition = node.getPositionArray();

    return this._createChanges(node.id, newPosition, oldPosition);
  }

  _createChanges(nodeId, newPosition, oldPosition) {
    return createChanges(
      ChangeNodePosition.createDef(nodeId, newPosition),
      ChangeNodePosition.createDef(nodeId, oldPosition)
    );
  }

  static createDef(nodeId, position) {
    return createDefinition(ChangeNodePosition.NAME, {
      nodeId,
      position
    })
  }
}
