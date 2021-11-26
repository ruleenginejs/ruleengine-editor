import { createChanges, createDefinition, EditCommand } from "@/utils/edit-command";
import { CreateNewConnection } from "./create-new-connection";

export class DeleteConnectionById extends EditCommand {
  static NAME = "delete-connection-by-id";

  constructor(payload) {
    super(DeleteConnectionById.NAME, payload);
  }

  doApply(model, payload) {
    const { connectionId } = payload;
    if (!connectionId) return null;

    const connection = model.getConnectionById(connectionId);
    if (!connection) return null;

    model.deleteConnectionById(connection.id);
    return this._createChanges(connection.id, connection.definition);
  }

  _createChanges(connectionId, connectionDef) {
    return createChanges(
      DeleteConnectionById.createDef(connectionId),
      CreateNewConnection.createDef(connectionDef)
    )
  }

  static createDef(connectionId) {
    return createDefinition(DeleteConnectionById.NAME, {
      connectionId
    })
  }
}
