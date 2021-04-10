import { computed } from "vue";
import { isDefined } from "@/utils/types";
import { SelectableModel } from "./selectable-model";
import { createInstance } from "./graph-base-model";

export class GraphConnectionModel extends SelectableModel {
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

    this.srcNode = srcNode;
    this.srcPort = srcPort;
    this.destNode = destNode;
    this.destPort = destPort;
    this.color = undefined;

    this.from = null;
    this.to = null;
  }

  _initComputed() {
    super._initComputed();

    this.from = computed(() => ({
      nodeId: this.srcNode.id,
      portId: this.srcPort.id
    }));

    this.to = computed(() => ({
      nodeId: this.destNode.id,
      portId: this.destPort.id
    }));
  }

  _buildValue() {
    return {
      stepId: this.destNode.id,
      srcOutPort: this.srcPort.getValue(),
      dstInPort: this.destPort.getValue()
    };
  }

  srcEquals(pair) {
    if (!pair) return false;
    const { nodeId, portId } = this.from;
    return nodeId === pair.nodeId &&
      portId === pair.portId;
  }

  destEquals(pair) {
    if (!pair) return false;
    const { nodeId, portId } = this.to;
    return nodeId === pair.nodeId &&
      portId === pair.portId;
  }
}

export function createConnection(srcNode, srcPort, destNode, destPort) {
  return createInstance(GraphConnectionModel, srcNode, srcPort, destNode, destPort);
}
