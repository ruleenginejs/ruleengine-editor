import { ChangeNodeProperty } from "./change-node-property";

export class ChangeNodeHandlerFile extends ChangeNodeProperty {
  static NAME = "change-node-handler-file";

  constructor(payload) {
    super(ChangeNodeHandlerFile.NAME, payload);
  }

  changeProperty(node, value) {
    const oldValue = node.changeHandlerFilePath(value);
    const newValue = node.handlerFile;
    return { oldValue, newValue };
  }

  static createDef(nodeId, value) {
    return ChangeNodeProperty.createDef(ChangeNodeHandlerFile.NAME, nodeId, value);
  }
}
