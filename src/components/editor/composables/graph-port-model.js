import { isDefined, notEmptyString } from '@/utils/types';
import { computed } from 'vue';
import { createInstance } from './graph-base-model';
import { GraphPortType } from './graph-port-type';
import { SelectableModel } from './selectable-model';

export const DEFAULT_PORT = 'default';
export const ERROR_PORT = 'error';

export class GraphPortModel extends SelectableModel {
  constructor(nodeId, name, type) {
    super();

    if (!isDefined(nodeId)) {
      throw new Error('Argument nodeId is required');
    }

    this.nodeId = nodeId;

    if (notEmptyString(name)) {
      this.name = name;
    } else {
      this.name = DEFAULT_PORT;
    }

    if (type === GraphPortType.IN || type === GraphPortType.OUT) {
      this.type = type;
    } else {
      this.type = GraphPortType.IN;
    }

    this.disabled = false;

    if (this.type === GraphPortType.OUT) {
      this.linkLimit = 1;
    } else {
      this.linkLimit = null;
    }

    this.isErrorPort = false;
  }

  _initComputed() {
    super._initComputed();
    this.isErrorPort = computed(() => this.name === ERROR_PORT);
  }

  _buildValue() {
    return this.name;
  }

  changeName(newValue) {
    const oldValue = this.name;
    this.name = newValue;
    return { oldValue, newValue };
  }

  changeDisabled(newValue) {
    const oldValue = this.disabled;
    this.disabled = !!newValue;
    return { oldValue, newValue };
  }
}

export function createPort(nodeId, name, type) {
  return createInstance(GraphPortModel, nodeId, name, type);
}
