import { EditCommand } from "@/utils/edit-command";

export class ChangeNodePosition extends EditCommand {
  static NAME = "change-node-position";

  constructor(payload, reversePayload) {
    super(ChangeNodePosition.NAME, payload, reversePayload);
  }

  doExecute(model, payload) {
    const { nodeId, position } = payload;
    if (!nodeId || !Array.isArray(position)) return null;

    const node = model.getNodeById(nodeId);
    if (!node) return null;

    const oldPosition = node.changePosition(position);
    const newPosition = node.getPositionArray();
    return this._createChanges(node.id, newPosition, oldPosition);
  }

  _createChanges(nodeId, newPosition, oldPosition) {
    return EditCommand.getRaw(this.name, {
      nodeId,
      position: newPosition
    }, {
      nodeId,
      position: oldPosition
    })
  }

  static createRaw(nodeId, newPosition) {
    return EditCommand.getRaw(ChangeNodePosition.NAME, {
      nodeId,
      position: newPosition
    });
  }
}
