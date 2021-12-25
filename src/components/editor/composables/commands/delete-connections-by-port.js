import { createChanges, createDefinition, EditCommand } from "@/utils/edit-command";
import { CreateNewConnection } from "./create-new-connection";

export class DeleteConnectionsByPort extends EditCommand {
  static NAME = "delete-connections-by-port";

  constructor(payload) {
    super(DeleteConnectionsByPort.NAME, payload);
  }

  doApply(model, payload) {
    const { nodeId, portId } = payload;
    if (!nodeId) return null;

    const node = model.getNodeById(nodeId);
    if (!node) return null;

    const port = node.getPortById(portId);
    if (!port) return null;

    const connections = model.getConnectionsByNodeAndPort(node.id, port.id, port.type);
    if (connections.length === 0) return null;

    const changes = [];
    for (let connection of connections) {
      model.deleteConnectionById(connection.id);
      changes.push(this._createChanges(node.id, port.id, connection.definition));
    }
    return changes;
  }

  _createChanges(nodeId, portId, connectionDef) {
    return createChanges(
      DeleteConnectionsByPort.createDef(nodeId, portId),
      CreateNewConnection.createDef(connectionDef)
    )
  }

  static createDef(nodeId, portId) {
    return createDefinition(DeleteConnectionsByPort.NAME, {
      nodeId,
      portId
    })
  }
}
