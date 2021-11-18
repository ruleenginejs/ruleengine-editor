import { ChangePortProperty } from "./change-port-property";

export class ChangePortDisabled extends ChangePortProperty {
  static NAME = "change-port-disabled";

  constructor(payload) {
    super(ChangePortDisabled.NAME, payload);
  }

  changeProperty(port, newValue) {
    return port.changeDisabled(newValue);
  }

  static createDef(nodeId, portId, value) {
    return ChangePortProperty.createDef(ChangePortDisabled.NAME,
      nodeId,
      portId,
      value
    )
  }
}
