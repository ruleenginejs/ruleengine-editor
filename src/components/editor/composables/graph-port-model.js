import { notEmptyString } from "@/utils/types";
import { ref, computed } from "vue";

export class GraphPortModel {
  static _nextId = 0;

  constructor(name, type) {
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
    this.direction = computed(() => this.type.value === "in" ? "left" : "right");
    this.linkLimit = ref(1);
  }
}

export function createPort(name, type) {
  return new GraphPortModel(name, type);
}
