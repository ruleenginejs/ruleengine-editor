import { ChangePortProperty } from './change-port-property';

export class ChangePortName extends ChangePortProperty {
  static NAME = 'change-port-name';

  constructor(payload) {
    super(ChangePortName.NAME, payload);
  }

  changeProperty(port, newValue) {
    return port.changeName(newValue);
  }

  static createDef(nodeId, portId, value) {
    return ChangePortProperty.createDef(
      ChangePortName.NAME,
      nodeId,
      portId,
      value
    );
  }
}
