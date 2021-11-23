import { createChanges, createDefinition, EditCommand } from "@/utils/edit-command";
import { CreateNewConnection } from "./create-new-connection";

export class DeleteConnectionByPort extends EditCommand {
  static NAME = "delete-connection-by-port";

  constructor(payload) {
    super(DeleteConnectionByPort.NAME, payload);
  }

  doApply(model, payload) {
    const { nodeId, portId } = payload;
    if (!nodeId) return null;

    const node = model.getNodeById(nodeId);
    if (!node) return null;

    const port = node.getPortById(portId);
    if (!port) return null;

    const connection = model.getConnectionByNodeAndPort(node.id, port.id, port.type);
    if (!connection) return null;

    model.deleteConnectionById(connection.id);
    return this._createChanges(node.id, port.id, connection.definition);
  }

  _createChanges(nodeId, portId, connectionDef) {
    return createChanges(
      DeleteConnectionByPort.createDef(nodeId, portId),
      CreateNewConnection.createDef(connectionDef)
    )
  }

  static createDef(nodeId, portId) {
    return createDefinition(DeleteConnectionByPort.NAME, {
      nodeId,
      portId
    })
  }
}
