import {
  createChanges,
  createDefinition,
  EditCommand
} from '@/utils/edit-command';
import { ConnectionDefinition } from '../connection-definition';
import { CreateNewConnection } from './create-new-connection';

export class DeleteConnection extends EditCommand {
  static NAME = 'delete-connection';

  constructor(payload) {
    super(DeleteConnection.NAME, payload);
  }

  doApply(model, payload) {
    const connectionDef = new ConnectionDefinition(payload.from, payload.to);
    if (!connectionDef.isValid()) return null;

    const connection = model.findConnectionByDef(connectionDef);
    if (!connection) return null;

    model.deleteConnectionById(connection.id);
    return this._createChanges(connection.definition);
  }

  _createChanges(connectionDef) {
    return createChanges(
      DeleteConnection.createDef(connectionDef),
      CreateNewConnection.createDef(connectionDef)
    );
  }

  static createDef(connectionDef) {
    return createDefinition(DeleteConnection.NAME, connectionDef.toJSON());
  }
}
