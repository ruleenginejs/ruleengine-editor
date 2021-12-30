import { computed, nextTick } from "vue"
import merge from "merge";
import localize from "@/utils/localize";
import { round } from "@/utils/numbers";
import { emptyString, isDefined, isPlainObject, notEmptyString } from "@/utils/types";
import { GraphNodeType, isNavNodeType, validateNodeType } from "./graph-node-type";
import { createPort, DEFAULT_PORT } from "./graph-port-model";
import { SelectableModel } from "./selectable-model";
import { GraphPortType } from "./graph-port-type";
import { createInstance, updateNextUid } from "./graph-base-model";
import { PACKAGE_PREFIX, posixIsAbsolute, RELATIVE_PREFIX, replaceBackslash, winIsAbsolute } from "@/utils/path";

export class GraphNodeModel extends SelectableModel {
  constructor(options) {
    super();
    options = options || {};

    if (notEmptyString(options.id) || typeof options.id === "number") {
      this.id = options.id;

      if (typeof this.id === "number") {
        updateNextUid(this.id);
      }
    }

    if (notEmptyString(options.type) && validateNodeType(options.type)) {
      this.type = options.type.toLowerCase();
    } else {
      this.type = GraphNodeType.Single;
    }

    this.isNavNode = isNavNodeType(this.type);
    this.isErrorNode = this.type === GraphNodeType.Error;

    if (this.isNavNode) {
      this.name = this._getNameFromType(this.type);
    } else if (notEmptyString(options.name)) {
      this.name = options.name;
    } else {
      this.name = null;
    }

    if (this.isNavNode) {
      const ports = this._parsePorts(this.id, null);

      if (this.type === GraphNodeType.End) {
        this.ports = [ports.in[0]];
      } else {
        this.ports = [ports.out[0]];
      }
    } else {
      const ports = this._parsePorts(this.id, options.ports);
      this.ports = ports.in.concat(ports.out);
    }

    if (isPlainObject(options.props)) {
      this.props = merge.recursive(true, options.props, {});
    } else {
      this.props = {};
    }

    if (notEmptyString(options.handler)) {
      this.handlerSource = options.handler;
    } else {
      this.handlerSource = null;
    }

    this.handlerFile = this._parseHandlerFile(options.handlerFile);

    if (this.isErrorNode) {
      this.titleLength = 2;
    } else if (this.isNavNode) {
      this.titleLength = 1;
    } else {
      this.titleLength = undefined;
    }

    const position = this._parsePosition(options.canvas);
    this.positionX = position.x;
    this.positionY = position.y;
    this.headerColor = this._parseHeaderColor(options.canvas);

    this.hasHandler = false;
    this.inPorts = [];
    this.outPorts = [];
    this.invalidate = false;
  }

  _initComputed() {
    super._initComputed();

    this.hasHandler = computed(() => {
      return isDefined(this.handlerSource) || isDefined(this.handlerFile)
    });

    if (this.isNavNode) {
      this.inPorts = computed(() => [this.ports[0]]);
      this.outPorts = computed(() => [this.ports[0]]);
    } else {
      this.inPorts = computed(() => this.ports.filter(p => p.type === GraphPortType.IN));
      this.outPorts = computed(() => this.ports.filter(p => p.type === GraphPortType.OUT));
    }
  }

  _buildValue() {
    const value = {
      id: this.id,
      type: this.type
    }

    if (this.name) {
      value.name = this.name;
    }

    value.ports = this._buildPorts();

    const props = this._buildProps();
    if (props) {
      value.props = props;
    }

    if (!this.isNavNode) {
      if (isDefined(this.handlerFile)) {
        value.handlerFile = this._buildHandlerFile();
      } else if (isDefined(this.handler)) {
        value.handler = this.handler;
      }
    }

    value.canvas = this._buildCanvas();
    return value;
  }

  _buildCanvas() {
    const value = {
      position: [
        round(this.positionX, 2),
        round(this.positionY, 2)
      ]
    }
    if (isDefined(this.headerColor)) {
      value.color = this.headerColor;
    }
    return value;
  }

  _buildProps() {
    if (Object.keys(this.props).length > 0) {
      return merge.recursive(true, this.props, {});
    }
    return null;
  }

  _buildPorts() {
    return {
      in: this.inPorts.map(port => port.getValue()),
      out: this.outPorts.map(port => port.getValue())
    }
  }

  _buildHandlerFile() {
    if (emptyString(this.handlerFile)) {
      return null;
    } else if (this.handlerFile.startsWith(PACKAGE_PREFIX)) {
      return this.handlerFile.slice(PACKAGE_PREFIX.length);
    } else if (this.handlerFile.startsWith(RELATIVE_PREFIX)) {
      return this.handlerFile;
    } else if (posixIsAbsolute(this.handlerFile) || winIsAbsolute(this.handlerFile)) {
      return this.handlerFile;
    } else {
      return `${RELATIVE_PREFIX}${this.handlerFile}`;
    }
  }

  _parsePorts(nodeId, ports) {
    const inPorts = new Set([DEFAULT_PORT]);
    const outPorts = new Set([DEFAULT_PORT]);

    if (isPlainObject(ports)) {
      const { in: _in, out } = ports;

      if (Array.isArray(_in)) {
        _in.forEach(portName => {
          if (notEmptyString(portName)) {
            inPorts.add(portName);
          }
        });
      }
      if (Array.isArray(out)) {
        out.forEach(portName => {
          if (notEmptyString(portName)) {
            outPorts.add(portName);
          }
        });
      }
    }

    const _in = [...inPorts].map(
      name => createPort(nodeId, name, GraphPortType.IN));

    const out = [...outPorts].map(
      name => createPort(nodeId, name, GraphPortType.OUT));

    const result = {
      in: _in,
      out
    };

    return result;
  }

  _parsePosition(canvasOptions) {
    if (isPlainObject(canvasOptions)) {
      return this._toPoint(canvasOptions.position);
    }
    return this._toPoint();
  }

  _parseHeaderColor(canvasOptions) {
    if (!isPlainObject(canvasOptions)) {
      return null;
    }

    const color = canvasOptions.color;
    if (notEmptyString(color)) {
      return color;
    }

    return null;
  }

  _parseHandlerFile(handlerFile) {
    if (emptyString(handlerFile)) {
      return null;
    }
    handlerFile = replaceBackslash(handlerFile);
    if (handlerFile.startsWith(PACKAGE_PREFIX)) {
      return handlerFile;
    } else if (handlerFile.startsWith(RELATIVE_PREFIX)) {
      return handlerFile.slice(RELATIVE_PREFIX.length);
    } else if (posixIsAbsolute(handlerFile) || winIsAbsolute(handlerFile)) {
      return handlerFile;
    } else {
      return `${PACKAGE_PREFIX}${handlerFile}`;
    }
  }

  _toPoint(point) {
    if (!Array.isArray(point)) {
      return { x: 0, y: 0 };
    }

    let x = point[0];
    if (typeof x !== "number") {
      x = 0;
    }

    let y = point[1];
    if (typeof y !== "number") {
      y = 0;
    }

    return { x, y };
  }

  _getNameFromType(type) {
    switch (type) {
      case GraphNodeType.Start:
        return localize("editor.startNode");
      case GraphNodeType.End:
        return localize("editor.endNode");
      case GraphNodeType.Error:
        return localize("editor.errorNode");
      default:
        return null;
    }
  }

  setInvalidate(value) {
    this.invalidate = value;
  }

  invalidateAsync() {
    nextTick(() => {
      this.invalidate = true;
    });
  }

  findOutPortByName(portName) {
    return this.outPorts.find(port => port.name === portName);
  }

  findInPortByName(portName) {
    return this.inPorts.find(port => port.name === portName);
  }

  getPortById(portId) {
    for (let i = 0, len = this.ports.length; i < len; i++) {
      const port = this.ports[i];
      if (port.id === portId) {
        return port;
      }
    }
    return null;
  }

  getDefaultOutPort() {
    return this.getPortByTypeAndName(GraphPortType.OUT, DEFAULT_PORT);
  }

  getDefaultInPort() {
    return this.getPortByTypeAndName(GraphPortType.IN, DEFAULT_PORT);
  }

  getPortByTypeAndName(portType, portName) {
    for (let i = 0, len = this.ports.length; i < len; i++) {
      const port = this.ports[i];
      if (port.type === portType && port.name === portName) {
        return port;
      }
    }
    return null;
  }

  getPortsByType(portType) {
    if (portType === GraphPortType.IN) {
      return this.inPorts;
    } else if (portType === GraphPortType.OUT) {
      return this.outPorts;
    } else {
      return [];
    }
  }

  createPort(portType, name, disabled) {
    if (this.isNavNode) {
      return null;
    }
    const port = createPort(this.id, null, portType);
    port.name = name;
    port.disabled = disabled;
    this.ports.push(port);
    return port;
  }

  removePort(portId) {
    if (this.isNavNode) {
      return false;
    }
    const index = this.ports.findIndex(p => p.id === portId);
    if (index !== -1) {
      this.ports.splice(index, 1);
      return true;
    }
    return false;
  }

  getPositionArray() {
    return [this.positionX, this.positionY];
  }

  inPosition(x, y, tolerance = null) {
    if (isDefined(tolerance)) {
      return Math.abs(this.positionX - x) < tolerance &&
        Math.abs(this.positionY - y) < tolerance;
    } else {
      return this.positionX === x && this.positionY === y;
    }
  }

  changePosition(position) {
    const oldPosition = this.getPositionArray();
    const { x, y } = this._toPoint(position);
    this.positionX = x;
    this.positionY = y;
    return oldPosition;
  }

  changeName(name) {
    const oldName = this.name;
    if (this.isNavNode) {
      return oldName;
    }
    if (notEmptyString(name)) {
      this.name = name;
    } else {
      this.name = null;
    }
    return oldName;
  }

  changeHandlerFile(filePath) {
    const oldValue = this.handlerFile;
    if (this.isNavNode) {
      return { oldValue, newValue: this.handlerFile };
    }
    if (notEmptyString(filePath)) {
      this.handlerFile = replaceBackslash(filePath);
    } else {
      this.handlerFile = null;
    }
    return { oldValue, newValue: this.handlerFile };
  }

  changeColor(newValue) {
    const oldValue = this.headerColor;
    if (notEmptyString(newValue)) {
      this.headerColor = newValue;
    } else {
      this.headerColor = null;
    }
    return { oldValue, newValue: this.headerColor }
  }
}

export function createNode(data) {
  return createInstance(GraphNodeModel, data);
}
