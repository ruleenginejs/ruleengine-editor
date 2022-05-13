import { ChangeNodeProperty } from './change-node-property';

export class ChangeNodeName extends ChangeNodeProperty {
  static NAME = 'change-node-name';

  constructor(payload) {
    super(ChangeNodeName.NAME, payload);
  }

  changeProperty(node, value) {
    const oldValue = node.changeName(value);
    const newValue = node.name;
    return { oldValue, newValue };
  }

  static createDef(nodeId, value) {
    return ChangeNodeProperty.createDef(ChangeNodeName.NAME, nodeId, value);
  }
}
