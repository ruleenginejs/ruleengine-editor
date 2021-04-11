import { computed } from "vue";
import { isDefined } from "@/utils/types";
import { SelectableModel } from "./selectable-model";
import { createInstance } from "./graph-base-model";
import { ConnectionDefinition } from "./connection-definition";
import { GraphPortType } from "./graph-port-type";

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

    if (srcPort.type !== GraphPortType.OUT) {
      throw new Error("srcPort must be outgoing port");
    }

    if (destPort.type !== GraphPortType.IN) {
      throw new Error("destPort must be incoming port");
    }

    this.srcNode = srcNode;
    this.srcPort = srcPort;
    this.destNode = destNode;
    this.destPort = destPort;
    this.color = undefined;

    this.from = null;
    this.to = null;
    this.definition = null;
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

    this.definition = computed(() => new ConnectionDefinition({
      nodeId: this.srcNode.id,
      outPort: this.srcPort.name
    }, {
      nodeId: this.destNode.id,
      inPort: this.destPort.name
    }));
  }

  _buildValue() {
    return {
      stepId: this.destNode.id,
      srcOutPort: this.srcPort.getValue(),
      dstInPort: this.destPort.getValue()
    };
  }

  isSrcOrDest(nodeId, portId) {
    return this.isSrc(nodeId, portId) || this.isDest(nodeId, portId);
  }

  isSrc(nodeId, portId) {
    return this.srcNode.id === nodeId && this.srcPort.id === portId
  }

  isDest(nodeId, portId) {
    return this.destNode.id === nodeId && this.destPort.id === portId
  }
}

export function createConnection(srcNode, srcPort, destNode, destPort) {
  return createInstance(GraphConnectionModel, srcNode, srcPort, destNode, destPort);
}
