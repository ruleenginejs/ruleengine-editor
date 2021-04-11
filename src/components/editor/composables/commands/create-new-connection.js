import { createChanges, createDefinition, EditCommand } from "@/utils/edit-command";
import { ConnectionDefinition } from "../connection-definition";
import { DeleteConnection } from "./delete-connection";

export class CreateNewConnection extends EditCommand {
  static NAME = "create-new-connection";

  constructor(payload) {
    super(CreateNewConnection.NAME, payload);
  }

  doApply(model, payload) {
    const connectionDef = new ConnectionDefinition(payload.from, payload.to);
    if (!connectionDef.isValid()) return null;

    if (model.outConnectionExistsByPortName(connectionDef.fromNodeId, connectionDef.outPort)) {
      return null;
    }

    const newConnection = model.createConnection(connectionDef);
    if (!newConnection) return null;

    return this._createChanges(newConnection.definition);
  }

  _createChanges(connectionDef) {
    return createChanges(
      CreateNewConnection.createDef(connectionDef),
      DeleteConnection.createDef(connectionDef)
    )
  }

  static createDef(connectionDef) {
    return createDefinition(CreateNewConnection.NAME, connectionDef.toJSON())
  }
}
