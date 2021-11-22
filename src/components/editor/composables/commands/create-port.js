import { createChanges, createDefinition, EditCommand } from "@/utils/edit-command";
import { DeletePort } from "./delete-port";

export class CreatePort extends EditCommand {
  static NAME = "create-port";

  constructor(payload) {
    super(CreatePort.NAME, payload);
  }

  doApply(model, payload) {
    const { nodeId, type, disabled, name } = payload;

    if (!nodeId) {
      return null;
    }

    const node = model.getNodeById(nodeId);
    if (!node) return null;

    const newPort = node.createPort(type, name, disabled);
    if (!newPort) return null;

    return this._createChanges(newPort);
  }

  _createChanges(port) {
    return createChanges(
      CreatePort.createDef(port.nodeId, port.type, port.name, port.disabled),
      DeletePort.createDef(port.nodeId, port.id),
    )
  }

  static createDef(nodeId, type, name, disabled) {
    return createDefinition(CreatePort.NAME, {
      nodeId,
      type,
      disabled,
      name
    })
  }
}
