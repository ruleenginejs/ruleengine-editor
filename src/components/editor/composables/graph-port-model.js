import { notEmptyString } from "@/utils/types";
import { computed } from "vue";
import { createInstance } from "./graph-base-model";
import { GraphPortType } from "./graph-port-type";
import { SelectableModel } from "./selectable-model";

export const DEFAULT_PORT = "default";
export const ERROR_PORT = "error";

export class GraphPortModel extends SelectableModel {
  constructor(name, type) {
    super();

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
    this.linkLimit = 1;

    this.isErrorPort = false;
  }

  _initComputed() {
    super._initComputed();
    this.isErrorPort = computed(() => this.name === ERROR_PORT);
  }

  _buildValue() {
    return this.name;
  }
}

export function createPort(name, type) {
  return createInstance(GraphPortModel, name, type);
}
