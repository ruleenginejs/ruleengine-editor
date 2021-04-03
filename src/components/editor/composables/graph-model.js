import { reactive, ref } from "vue"
import { isPlainObject } from "is-plain-object";
import { isDefined } from "./types";
import { createNode } from "./graph-node-model";
import { createConnection } from "./graph-connection-model";

let _nextId = 0;

export class GraphModel {
  constructor(value) {
    debugger;
    this.id = ref(++_nextId);
    this.error = ref(null);
    this.selected = ref(true);
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
    debugger;
    if (value === null || value === undefined) {
      return;
    }
    if (isDefined(value) && isPlainObject(value)) {
      this._parseData(value);
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
        this.error.value = new Error("The value must contain an object json format");
      }
    } catch (err) {
      this.error.value = err;
    }
  }

  _parseData(data) {
    debugger;
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
    debugger;
    if (!Array.isArray(steps)) {
      return;
    }
    const connections = [];
    for (let i = 0, len = steps.length; i < len; i++) {
      const step = steps[i];
      if (isDefined(step) && isPlainObject(step)) {
        const node = createNode(step);
        this.nodes.push(node);
        connections.push({ srcId: node.id, connectionItems: step.connect });
      }
    }
    this._parseConnections(connections);
  }

  _parseConnections(connectionDataArray) {
    debugger;
    const nodeIdsMap = this.nodes.reduce((res, item) => {
      res[item.id] = true;
      return res;
    }, {});
    for (let i = 0, len = connectionDataArray.len; i < len; i++) {
      const { srcId, connectionItems } = connectionDataArray[i];
      if (isDefined(srcId) && Array.isArray(connectionItems)) {
        const fromNodeId = srcId;
        if (!nodeIdsMap[fromNodeId]) continue;

        for (let j = 0, len2 = connectionItems.length; j < len2; j++) {
          const connectionItem = connectionItems[j];
          if (isDefined(connectionItem) && isPlainObject(connectionItem)) {
            const toNodeId = connectionItem.stepId;
            if (!nodeIdsMap[toNodeId]) continue;
            this.connections.push(createConnection(
              fromNodeId, toNodeId,
              connectionItem.srcOutPort, connectionItem.dstInPort
            ))
          }
        }
      }
    }
  }
}

export function createModel(value) {
  return new GraphModel(value);
}
