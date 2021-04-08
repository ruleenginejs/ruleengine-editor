import { EditCommand } from "./command";
import { EditCommandsRegistry } from "./command-registry";

export class ChangeNodePosition extends EditCommand {
  static NAME = "change-node-position";

  constructor(payload, reversePayload) {
    super(ChangeNodePosition.NAME, payload, reversePayload);
  }

  static createRaw(nodeId, newPosition) {
    return {
      name: ChangeNodePosition.NAME,
      payload: {
        nodeId,
        position: newPosition
      }
    }
  }
}

EditCommandsRegistry.current.registerCommand(ChangeNodePosition.NAME, ChangeNodePosition);
