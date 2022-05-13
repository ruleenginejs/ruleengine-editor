import { ChangeNodeProperty } from './change-node-property';

export class ChangeNodePosition extends ChangeNodeProperty {
  static NAME = 'change-node-position';

  constructor(payload) {
    super(ChangeNodePosition.NAME, payload);
  }

  changeProperty(node, value) {
    const oldValue = node.changePosition(value);
    const newValue = node.getPositionArray();
    return { oldValue, newValue };
  }

  static createDef(nodeId, value) {
    return ChangeNodeProperty.createDef(ChangeNodePosition.NAME, nodeId, value);
  }
}
