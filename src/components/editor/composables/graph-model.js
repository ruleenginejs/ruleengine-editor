import { computed } from "vue"
import isPlainObject from "is-plain-object";
import { isDefined } from "@/utils/types";
import { applyEditCommands, applyReverseEditCommands } from "@/utils/edit-command";
import { createNode } from "./graph-node-model";
import { createConnection } from "./graph-connection-model";
import { SelectableModel } from "./selectable-model";
import { DEFAULT_PORT } from "./graph-port-model";
import { createInstance, generateUid } from "./graph-base-model";

export class GraphModel extends SelectableModel {
  constructor(value) {
    super();

    this.id = generateUid();
    this.error = null;
    this.nodes = [];
    this.connections = [];
    this.versionId = 0;
    this.title = null;
    this.description = null;
    this.selectedObject = null;
    this._changeListeners = [];

    this._parseValue(value);
  }

  _initComputed() {
    super._initComputed();
    this.selectedObject = computed(() => this._findSelectedObject());
  }

  _buildValue() {
    return { type: "GraphModel", id: this.id };
  }

  _parseValue(value) {
    if (value === null || value === undefined) {
      return;
    }
    if (isDefined(value) && isPlainObject(value)) {
      try {
        this._parseData(value);
      } catch (err) {
        this.error = err;
      }
      return;
    }
    if (typeof value !== "string") {
      this.error = new Error("Argument value must be a string");
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
        this.error = new Error("The value must contain an object");
      }
    } catch (err) {
      this.error = err;
    }
  }

  _parseData(data) {
    const { title, description, steps } = data;

    if (typeof title === "string" && title.length > 0) {
      this.title = title;
    }
    if (typeof description === "string" && description.length > 0) {
      this.description = description;
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
        connections.push({ srcNodeId: node.id, connectionItems: step.connect });
      }
    }
    this._parseConnections(this.nodes, connections);
  }

  _parseConnections(nodes, connectionDataArray) {
    const nodesById = nodes.reduce((res, node) => {
      res[node.id] = node;
      return res;
    }, {});

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

        const srcOutPortName = connectionItem.srcOutPort || DEFAULT_PORT;
        const srcPort = srcNode.findOutPortByName(srcOutPortName);
        if (!srcPort) {
          continue;
        }

        const destInPortName = connectionItem.dstInPort || DEFAULT_PORT;
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

  _increaseVersionId() {
    this.versionId = this.versionId + 1;
  }

  _findSelectedObject() {
    if (this.selected) {
      return this;
    }

    const node = this._findSelectedNode();
    if (node) {
      return node;
    }

    const port = this._findSelectedPort();
    if (port) {
      return port;
    }

    const connection = this._findSelectedConnection();
    if (connection) {
      return connection;
    }

    return this;
  }

  _findSelectedNode() {
    return this.nodes.find(node => node.selected);
  }

  _findSelectedConnection() {
    return this.connections.find(connection => connection.selected);
  }

  _findSelectedPort() {
    let result = null;
    for (let i = 0, len = this.nodes.length; i < len; i++) {
      const ports = this.nodes[i].ports;

      for (let k = 0, len2 = ports.length; k < len2; k++) {
        const port = ports[k];
        if (port.selected) {
          result = port;
          break;
        }
      }
    }
    return result;
  }

  getNodesByType(...nodeTypes) {
    return this.nodes.filter(node => {
      if (nodeTypes.length === 1) {
        return node.type === nodeTypes[0];
      }
      return nodeTypes.includes(node.type);
    });
  }

  applyEdits(rawEditCommands, emitChangeEvent = true) {
    const changes = applyEditCommands(this, rawEditCommands);
    this._increaseVersionId();

    if (emitChangeEvent) {
      this.emitChangeEvent(changes);
    }
  }

  applyReverseEdits(rawEditCommands, emitChangeEvent = true) {
    const changes = applyReverseEditCommands(this, rawEditCommands);
    this._increaseVersionId();

    if (emitChangeEvent) {
      this.emitChangeEvent(changes);
    }
  }

  addChangeListener(listener) {
    if (typeof listener === "function") {
      this._changeListeners.push(listener);
    }
  }

  removeChangeListener(listener) {
    const index = this._changeListeners.indexOf(listener);
    if (index !== -1) {
      this._changeListeners.splice(index, 1);
    }
  }

  removeAllChangeListeners() {
    this._changeListeners = [];
  }

  emitChangeEvent(changes) {
    for (let i = 0; i < this._changeListeners.length; i++) {
      const listener = this._changeListeners[i];
      listener({
        changes,
        versionId: this.versionId
      })
    }
  }
}

export function createModel(value) {
  return createInstance(GraphModel, value);
}
