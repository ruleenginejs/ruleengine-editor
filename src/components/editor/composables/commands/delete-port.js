import { createChanges, createDefinition, EditCommand } from "@/utils/edit-command";
import { CreatePort } from "./create-port";

export class DeletePort extends EditCommand {
  static NAME = "delete-port";

  constructor(payload) {
    super(DeletePort.NAME, payload);
  }

  doApply(model, payload) {
    const { nodeId, portId } = payload;

    if (!nodeId || !portId) {
      return null;
    }

    const node = model.getNodeById(nodeId);
    if (!node) return null;

    const port = node.getPortById(portId);
    if (!port) return null;

    if (node.removePort(port.id)) {
      node.invalidateAsync();
    }
    return this._createChanges(port);
  }

  _createChanges(port) {
    return createChanges(
      DeletePort.createDef(port.nodeId, port.id),
      CreatePort.createDef(port.nodeId, port.type, port.name, port.disabled)
    )
  }

  static createDef(nodeId, portId) {
    return createDefinition(DeletePort.NAME, { nodeId, portId })
  }
}
