import { ChangeNodeValue } from "./change-node-value";

export class ChangeNodePosition extends ChangeNodeValue {
  static NAME = "change-node-position";

  constructor(payload) {
    super(ChangeNodePosition.NAME, payload);
  }

  changeValue(node, value) {
    return node.changePosition(value);
  }

  getNewValue(node) {
    return node.getPositionArray();
  }

  static createDef(nodeId, value) {
    return ChangeNodeValue.createDef(ChangeNodePosition.NAME, nodeId, value);
  }
}
