import { ChangeNodeProperty } from './change-node-property';

export class ChangeNodeHandlerFile extends ChangeNodeProperty {
  static NAME = 'change-node-handler-file';

  constructor(payload) {
    super(ChangeNodeHandlerFile.NAME, payload);
  }

  changeProperty(node, value) {
    return node.changeHandlerFile(value);
  }

  static createDef(nodeId, value) {
    return ChangeNodeProperty.createDef(
      ChangeNodeHandlerFile.NAME,
      nodeId,
      value
    );
  }
}
