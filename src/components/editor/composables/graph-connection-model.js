import { ref, computed } from "vue";
import { isDefined } from "@/utils/types";

export class GraphConnectionModel {
  static _nextId = 0;

  constructor(srcNode, srcPort, destNode, destPort) {
    if (!isDefined(srcNode)) {
      throw new Error("Argument srcNode is required");
    }
    if (!isDefined(srcPort)) {
      throw new Error("Argument srcPort is required");
    }
    if (!isDefined(destNode)) {
      throw new Error("Argument destNode is required");
    }
    if (!isDefined(destPort)) {
      throw new Error("Argument destPort is required");
    }

    this.id = ref(++GraphConnectionModel._nextId);
    this.srcNode = ref(srcNode);
    this.srcPort = ref(srcPort);
    this.destNode = ref(destNode);
    this.destPort = ref(destPort);

    this.from = computed(() => ({
      nodeId: this.srcNode.value.id,
      portId: this.srcPort.value.id
    }));

    this.to = computed(() => ({
      nodeId: this.destNode.value.id,
      portId: this.destPort.value.id
    }));
  }
}

export function createConnection(srcNode, srcPort, destNode, destPort) {
  return new GraphConnectionModel(srcNode, srcPort, destNode, destPort);
}
