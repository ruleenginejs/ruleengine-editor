import { ref, computed } from "vue";

let _nextId = 0;

export class GraphPortModel {
  constructor(name, type) {
    debugger;
    if (typeof name === "string" && name.length > 0) {
      this.name = ref(name);
    } else {
      this.name = ref("default");
    }

    if (type === "in" || type === "out") {
      this.type = ref(type);
    } else {
      this.type = ref("in");
    }

    this.id = ref(++_nextId);
    this.direction = computed(() => this.type === "in" ? "left" : "right");
    this.linkLimit = ref(1);
  }
}

export function createPort(name, type) {
  return new GraphPortModel(name, type);
}
