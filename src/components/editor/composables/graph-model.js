import { computed } from "vue"
import { isDefined, isPlainObject, notEmptyString } from "@/utils/types";
import { applyEditCommands } from "@/utils/edit-command";
import { createNode, GraphNodeModel } from "./graph-node-model";
import { createConnection } from "./graph-connection-model";
import { SelectableModel } from "./selectable-model";
import { DEFAULT_PORT } from "./graph-port-model";
import { createInstance } from "./graph-base-model";
import { GraphPortType } from "./graph-port-type";
import { GraphNodeType } from "./graph-node-type";

export class GraphModel extends SelectableModel {
  constructor(value) {
    super();

    this.error = null;
    this.nodes = [];
    this.connections = [];
    this.versionId = 0;
    this.title = null;
    this.description = null;

    this._changeListeners = [];
    this._states = [];

    this.selectedObject = null;
    this.nodesById = null;
    this.connectionsById = null;
    this.navNodes = null;
    this.stepNodes = null;
    this.startNode = null;
    this.errorNode = null;
    this.isEmptyValue = null;

    this._parseValue(value);
  }

  _initComputed() {
    super._initComputed();

    this.selectedObject = computed(() => this._findSelectedObject());

    this.nodesById = computed(() => this.nodes.reduce((res, node) => {
      res[node.id] = node;
      return res;
    }, {}));

    this.connectionsById = computed(() => this.connections.reduce((res, node) => {
      res[node.id] = node;
      return res;
    }, {}));

    this.navNodes = computed(() => this.getNodesByType(
      GraphNodeType.Start,
      GraphNodeType.End,
      GraphNodeType.Error
    ));

    this.stepNodes = computed(() => this.getNodesByType(
      GraphNodeType.Single,
      GraphNodeType.Composite
    ));

    this.startNode = computed(
      () => this.getNodesByType(GraphNodeType.Start)[0]);
    this.errorNode = computed(
      () => this.getNodesByType(GraphNodeType.Error)[0]);

    this.isEmptyValue = computed(
      () => this.nodes.length === 0 && this.connections.length === 0);
  }

  _buildValue() {
    const value = {};
    if (notEmptyString(this.title)) {
      value.title = this.title;
    }
    if (notEmptyString(this.description)) {
      value.description = this.description;
    }
    value.steps = this.nodes.map(node => node.getValue());
    this._buildConnections(value.steps);
    return value;
  }

  _buildConnections(steps) {
    const connectionValuesBySrcNodeId = this.connections.reduce((res, connection) => {
      if (!res[connection.srcNode.id]) {
        res[connection.srcNode.id] = [];
      }
      res[connection.srcNode.id].push(connection.getValue());
      return res;
    }, {});

    for (let i = 0, len = steps.length; i < len; i++) {
      const step = steps[i];
      const connectionValues = connectionValuesBySrcNodeId[step.id];
      if (connectionValues) {
        step.connect = connectionValues;
      }
    }
  }

  _parseValue(value) {
    if (value === null || value === undefined) {
      return;
    }
    if (isPlainObject(value)) {
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
      if (isPlainObject(data)) {
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
      if (isPlainObject(step)) {
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
        if (!isPlainObject(connectionItem)) {
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

  _savePersistentState() {
    const state = {
      selectedNodeId: null,
      isModelSelected: this.selected
    }
    if (!state.isModelSelected && this.selectedObject instanceof GraphNodeModel) {
      state.selectedNodeId = this.selectedObject.id;
    }
    this._states.push(state);
  }

  _restorePersistentState() {
    const state = this._states.pop();
    if (!state) return;

    if (state.isModelSelected) {
      this.selected = true;
    } else if (state.selectedNodeId) {
      const node = this.getNodeById(state.selectedNodeId);
      if (node) {
        node.selected = true;
      }
    }
  }

  setValue(value) {
    this._savePersistentState();

    this.error = null;
    this.nodes.splice(0);
    this.connections.splice(0);
    this.title = null;
    this.description = null;
    this._increaseVersionId();
    this._parseValue(value);

    this._restorePersistentState();
  }

  createNode(options) {
    const node = createNode(options);
    this.nodes.push(node);
    return node;
  }

  deleteNode(node) {
    this.deleteNodeById(node.id);
  }

  deleteNodeById(nodeId) {
    const index = this.nodes.findIndex(n => n.id === nodeId);
    if (index !== -1) {
      this.nodes.splice(index, 1);
    }
  }

  getNodesByType(...nodeTypes) {
    return this.nodes.filter(node => {
      if (nodeTypes.length === 1) {
        return node.type === nodeTypes[0];
      }
      return nodeTypes.includes(node.type);
    });
  }

  getNodeById(nodeId) {
    return this.nodesById[nodeId] ?? null;
  }

  findNodesByPosition(x, y, tolerance = null) {
    const result = [];
    for (let i = 0, len = this.nodes.length; i < len; i++) {
      const node = this.nodes[i];
      if (node.inPosition(x, y, tolerance)) {
        result.push(node);
      }
    }
    return result;
  }

  nodeExistsByPosition(x, y, tolerance = null) {
    for (let i = 0, len = this.nodes.length; i < len; i++) {
      const node = this.nodes[i];
      if (node.inPosition(x, y, tolerance)) {
        return true;
      }
    }
    return false;
  }

  getConnectionsForNode(nodeId) {
    const result = [];
    for (let i = 0, len = this.connections.length; i < len; i++) {
      const connection = this.connections[i];
      if (connection.srcNode.id === nodeId || connection.destNode.id === nodeId) {
        result.push(connection);
      }
    }
    return result;
  }

  connectionExists(nodeId, portId, portType = null) {
    return !!this.getConnectionByNodeAndPort(nodeId, portId, portType);
  }

  _createConnectionByNodeAndPortPredicate(nodeId, portId, portType = null) {
    const _in = portType === GraphPortType.IN;
    const out = portType === GraphPortType.OUT;
    const both = !isDefined(portType);

    return (connection) => (
      (both && connection.isSrcOrDest(nodeId, portId))
      || (out && connection.isSrc(nodeId, portId))
      || (_in && connection.isDest(nodeId, portId))
    );
  }

  getConnectionByNodeAndPort(nodeId, portId, portType = null) {
    const predicate = this._createConnectionByNodeAndPortPredicate(nodeId, portId, portType);
    for (let i = 0, len = this.connections.length; i < len; i++) {
      const connection = this.connections[i];
      if (predicate(connection)) {
        return connection;
      }
    }
    return null;
  }

  getConnectionsByNodeAndPort(nodeId, portId, portType = null) {
    const result = [];
    const predicate = this._createConnectionByNodeAndPortPredicate(nodeId, portId, portType);
    for (let i = 0, len = this.connections.length; i < len; i++) {
      const connection = this.connections[i];
      if (predicate(connection)) {
        result.push(connection);
      }
    }
    return result;
  }

  outConnectionExistsByPortName(nodeId, outPortName) {
    for (let i = 0, len = this.connections.length; i < len; i++) {
      const connection = this.connections[i];
      if (connection.srcNode.id === nodeId && connection.srcPort.name === outPortName) {
        return true;
      }
    }
    return false;
  }

  inConnectionExistsByPortName(nodeId, inPortName) {
    for (let i = 0, len = this.connections.length; i < len; i++) {
      const connection = this.connections[i];
      if (connection.destNode.id === nodeId && connection.destPort.name === inPortName) {
        return true;
      }
    }
    return false;
  }

  getConnectionById(connectionId) {
    return this.connectionsById[connectionId] ?? null;
  }

  createConnection(connectionDef) {
    const result = this.obtainConnectionDef(connectionDef);
    if (!result) return null;

    const { fromNode, outPort, toNode, inPort } = result;
    const connection = createConnection(fromNode, outPort, toNode, inPort);
    this.connections.push(connection);
    return connection;
  }

  obtainConnectionDef(connectionDef) {
    const fromNode = this.getNodeById(connectionDef.fromNodeId);
    if (!fromNode) return null;

    const outPort = fromNode.findOutPortByName(connectionDef.outPort);
    if (!outPort) return null;

    const toNode = this.getNodeById(connectionDef.toNodeId);
    if (!toNode) return null;

    const inPort = toNode.findInPortByName(connectionDef.inPort);
    if (!inPort) return null;

    return { fromNode, outPort, toNode, inPort };
  }

  findConnectionByDef(connectionDef) {
    for (let i = 0, len = this.connections.length; i < len; i++) {
      const connection = this.connections[i];
      if (connection.definition.equals(connectionDef)) {
        return connection;
      }
    }
    return null;
  }

  deleteConnectionById(connectionId) {
    const index = this.connections.findIndex(c => c.id === connectionId);
    if (index !== -1) {
      this.connections.splice(index, 1);
    }
  }

  applyEdits(rawEditCommands, emitChangeEvent = true) {
    const changes = applyEditCommands(this, rawEditCommands);
    if (changes.length > 0) {
      this._increaseVersionId();
      if (emitChangeEvent) {
        this.emitChangeEvent(changes);
      }
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
