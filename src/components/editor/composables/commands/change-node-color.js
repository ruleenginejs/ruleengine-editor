import { ChangeNodeProperty } from './change-node-property';

export class ChangeNodeColor extends ChangeNodeProperty {
  static NAME = 'change-node-color';

  constructor(payload) {
    super(ChangeNodeColor.NAME, payload);
  }

  changeProperty(node, newValue) {
    return node.changeColor(newValue);
  }

  static createDef(nodeId, value) {
    return ChangeNodeProperty.createDef(ChangeNodeColor.NAME, nodeId, value);
  }
}
