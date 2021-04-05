import { reactive, ref } from "vue"
import isPlainObject from "is-plain-object";
import { isDefined } from "@/utils/types";
import { createNode } from "./graph-node-model";
import { createConnection } from "./graph-connection-model";
import { SelectableModel } from "./selectable-model";

export class GraphModel extends SelectableModel {
  static _nextId = 0;
  static _defaultPortName = "default";

  constructor(value) {
    super();

    this.id = ref(++GraphModel._nextId);
    this.error = ref(null);
    this.nodes = reactive([]);
    this.connections = reactive([]);
    this.versionId = ref(0);
    this.title = ref(null);
    this.description = ref(null);

    this._parseValue(value);
  }

  getValue() {
    const value = this._buildValue();
    return JSON.stringify(value);
  }

  _buildValue() {
    return {};
  }

  _parseValue(value) {
    if (value === null || value === undefined) {
      return;
    }
    if (isDefined(value) && isPlainObject(value)) {
      try {
        this._parseData(value);
      } catch (err) {
        this.error.value = err;
      }
      return;
    }
    if (typeof value !== "string") {
      this.error.value = new Error("Argument value must be a string");
      return;
    }
    if (!value.length) {
      return;
    }
    try {
      const data = JSON.parse(value);
      if (isDefined(data) && isPlainObject(data)) {
        this._parseData(data);
      } else {
        this.error.value = new Error("The value must contain an object");
      }
    } catch (err) {
      this.error.value = err;
    }
  }

  _parseData(data) {
    const { title, description, steps } = data;

    if (typeof title === "string" && title.length > 0) {
      this.title.value = title;
    }
    if (typeof description === "string" && description.length > 0) {
      this.description.value = description;
    }

    this._parseSteps(steps);
  }

  _parseSteps(steps) {
    if (!Array.isArray(steps)) {
      return;
    }
    const connections = [];
    for (let i = 0, len = steps.length; i < len; i++) {
      const step = steps[i];
      if (isDefined(step) && isPlainObject(step)) {
        const node = createNode(step);
        this.nodes.push(node);
        connections.push({ srcNodeId: node.id.value, connectionItems: step.connect });
      }
    }
    this._parseConnections(connections);
  }

  _parseConnections(connectionDataArray) {
    const nodesById = this._getNodesById();

    for (let i = 0, len = connectionDataArray.length; i < len; i++) {
      const { srcNodeId, connectionItems } = connectionDataArray[i];
      if (!Array.isArray(connectionItems)) {
        continue;
      }

      const srcNode = nodesById[srcNodeId];
      if (!srcNode) {
        continue;
      }

      for (let k = 0, len2 = connectionItems.length; k < len2; k++) {
        const connectionItem = connectionItems[k];
        if (!isDefined(connectionItem) || !isPlainObject(connectionItem)) {
          continue;
        }

        const destNode = nodesById[connectionItem.stepId];
        if (!destNode) {
          continue;
        }

        const srcOutPortName = connectionItem.srcOutPort || GraphModel._defaultPortName;
        const srcPort = srcNode.findOutPortByName(srcOutPortName);
        if (!srcPort) {
          continue;
        }

        const destInPortName = connectionItem.dstInPort || GraphModel._defaultPortName;
        const destPort = destNode.findInPortByName(destInPortName);
        if (!destPort) {
          continue;
        }

        this.connections.push(createConnection(
          srcNode, srcPort,
          destNode, destPort
        ));
      }
    }
  }

  _getNodesById() {
    return this.nodes.reduce((res, node) => {
      res[node.id] = node;
      return res;
    }, {});
  }

  getNodesByType(...nodeTypes) {
    return this.nodes.filter(node => {
      if (nodeTypes.length === 1) {
        return node.type === nodeTypes[0];
      }
      return nodeTypes.includes(node.type);
    });
  }
}

export function createModel(value) {
  return new GraphModel(value);
}
