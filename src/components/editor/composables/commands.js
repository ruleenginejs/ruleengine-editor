import { EditCommand, EditCommandsRegistry } from "@/utils/edit-command";

export class ChangeNodePosition extends EditCommand {
  static NAME = "change-node-position";

  constructor(payload, reversePayload) {
    super(ChangeNodePosition.NAME, payload, reversePayload);
  }

  static createRaw(nodeId, newPosition) {
    return EditCommand.getRaw(ChangeNodePosition.NAME, {
      nodeId,
      position: newPosition
    });
  }
}

EditCommandsRegistry.current.registerCommand(ChangeNodePosition.NAME, ChangeNodePosition);
