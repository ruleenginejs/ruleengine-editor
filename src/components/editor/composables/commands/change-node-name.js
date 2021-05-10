import { ChangeNodeValue } from "./change-node-value";

export class ChangeNodeName extends ChangeNodeValue {
  static NAME = "change-node-name";

  constructor(payload) {
    super(ChangeNodeName.NAME, payload);
  }

  changeValue(node, value) {
    return node.changeName(value);
  }

  getNewValue(node) {
    return node.name;
  }

  static createDef(nodeId, value) {
    return ChangeNodeValue.createDef(ChangeNodeName.NAME, nodeId, value);
  }
}
