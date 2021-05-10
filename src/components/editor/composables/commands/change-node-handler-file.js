import { ChangeNodeValue } from "./change-node-value";

export class ChangeNodeHandlerFile extends ChangeNodeValue {
  static NAME = "change-node-handler-file";

  constructor(payload) {
    super(ChangeNodeHandlerFile.NAME, payload);
  }

  changeValue(node, value) {
    return node.changeHandlerFilePath(value);
  }

  getNewValue(node) {
    return node.handlerFile;
  }

  static createDef(nodeId, value) {
    return ChangeNodeValue.createDef(ChangeNodeHandlerFile.NAME, nodeId, value);
  }
}
