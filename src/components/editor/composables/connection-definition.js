import { isPlainObject } from "@/utils/types";

export class ConnectionDefinition {
  constructor(from, to) {
    this.fromNodeId = null;
    this.outPort = null;
    this.toNodeId = null;
    this.inPort = null;

    if (isPlainObject(from)) {
      this.fromNodeId = from.nodeId;
      this.outPort = from.outPort;
    }

    if (isPlainObject(to)) {
      this.toNodeId = to.nodeId;
      this.inPort = to.inPort;
    }
  }

  isValid() {
    return this.fromNodeId &&
      this.outPort &&
      this.toNodeId &&
      this.inPort;
  }

  toJSON() {
    return {
      from: {
        nodeId: this.fromNodeId,
        outPort: this.outPort
      },
      to: {
        nodeId: this.toNodeId,
        inPort: this.inPort
      }
    }
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  equals(other) {
    if (!other) return false;
    return this.fromNodeId === other.fromNodeId &&
      this.outPort === other.outPort &&
      this.toNodeId === other.toNodeId &&
      this.inPort === other.inPort;
  }
}
