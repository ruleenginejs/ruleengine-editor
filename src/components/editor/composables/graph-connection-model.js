import { ref, computed } from "vue";
import { isDefined } from "@/utils/types";
import { SelectableModel } from "./selectable-model";

export class GraphConnectionModel extends SelectableModel {
  static _nextId = 0;

  constructor(srcNode, srcPort, destNode, destPort) {
    super();

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
    this.srcNode = srcNode;
    this.srcPort = srcPort;
    this.destNode = destNode;
    this.destPort = destPort;

    this.from = computed(() => ({
      nodeId: this.srcNode.id,
      portId: this.srcPort.id
    }));

    this.to = computed(() => ({
      nodeId: this.destNode.id,
      portId: this.destPort.id
    }));

    this.color = ref(undefined);
  }
}

export function createConnection(srcNode, srcPort, destNode, destPort) {
  return new GraphConnectionModel(srcNode, srcPort, destNode, destPort);
}
