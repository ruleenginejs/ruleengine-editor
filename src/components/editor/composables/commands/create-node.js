import {
  createChanges,
  createDefinition,
  EditCommand
} from '@/utils/edit-command';
import { GraphNodeType } from '../graph-node-type';
import { DeleteNode } from './delete-node';

export class CreateNode extends EditCommand {
  static NAME = 'create-node';

  constructor(payload) {
    super(CreateNode.NAME, payload);
  }

  doApply(model, payload) {
    const { type } = payload;
    if (type === GraphNodeType.Start && model.startNode) {
      return null;
    }
    if (type === GraphNodeType.Error && model.errorNode) {
      return null;
    }

    const node = model.createNode(payload);
    if (!node) return null;

    return this._createChanges(node);
  }

  _createChanges(node) {
    return createChanges(
      CreateNode.createDef(node.toJSON()),
      DeleteNode.createDef(node.id)
    );
  }

  static createDef(nodeData) {
    return createDefinition(CreateNode.NAME, nodeData);
  }
}
