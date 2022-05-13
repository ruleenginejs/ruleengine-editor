import {
  createChanges,
  createDefinition,
  EditCommand
} from '@/utils/edit-command';

export class ChangeNodeUserProp extends EditCommand {
  static NAME = 'change-node-user-prop';

  constructor(payload) {
    super(ChangeNodeUserProp.NAME, payload);
  }

  doApply(model, payload) {
    const { nodeId, propName, value } = payload;
    if (!nodeId || !propName) return null;

    const node = model.getNodeById(nodeId);
    if (!node) return null;

    const { oldValue, newValue } = node.changeUserProp(propName, value);
    return this._createChanges(node.id, propName, newValue, oldValue);
  }

  _createChanges(nodeId, propName, newValue, oldValue) {
    return createChanges(
      ChangeNodeUserProp.createDef(nodeId, propName, newValue),
      ChangeNodeUserProp.createDef(nodeId, propName, oldValue)
    );
  }

  static createDef(nodeId, propName, value) {
    return createDefinition(ChangeNodeUserProp.NAME, {
      nodeId,
      propName,
      value
    });
  }
}
