import { notEmptyString } from "@/utils/types";
import { ref, computed } from "vue";
import { SelectableModel } from "./selectable-model";

export class GraphPortModel extends SelectableModel {
  static _nextId = 0;
  static _errorPortName = "error";

  constructor(name, type) {
    super();

    if (notEmptyString(name)) {
      this.name = ref(name);
    } else {
      this.name = ref("default");
    }

    if (type === "in" || type === "out") {
      this.type = ref(type);
    } else {
      this.type = ref("in");
    }

    this.id = ref(++GraphPortModel._nextId);
    this.disabled = ref(false);
    this.linkLimit = ref(1);

    this.isErrorPort = computed(() => {
      return this.name.value === GraphPortModel._errorPortName;
    });
  }
}

export function createPort(name, type) {
  return new GraphPortModel(name, type);
}
