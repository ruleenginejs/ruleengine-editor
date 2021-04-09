import { computed } from "vue"
import isPlainObject from "is-plain-object";
import merge from "merge";
import localize from "@/utils/localize";
import { isDefined, notEmptyString } from "@/utils/types";
import { GraphNodeType, isNavNodeType, validateNodeType } from "./graph-node-type";
import { createPort, DEFAULT_PORT } from "./graph-port-model";
import { SelectableModel } from "./selectable-model";
import { GraphPortType } from "./graph-port-type";
import { createInstance, generateUid, updateNextUid } from "./graph-base-model";

export class GraphNodeModel extends SelectableModel {
  constructor(options) {
    super();
    options = options || {};

    if (notEmptyString(options.id) || typeof options.id === "number") {
      this.id = options.id;

      if (typeof this.id === "number") {
        updateNextUid(this.id);
      }
    } else {
      this.id = generateUid();
    }

    if (notEmptyString(options.type) && validateNodeType(options.type.toLowerCase())) {
      this.type = options.type.toLowerCase();
    } else {
      this.type = GraphNodeType.Single;
    }

    this.isNavNode = isNavNodeType(this.type);
    this.isErrorNode = this.type === GraphNodeType.Error;

    if (notEmptyString(options.name)) {
      this.name = options.name;
    } else {
      this.name = this._getNameFromTypeOrDefault(this.type, this.id);
    }

    if (this.isNavNode) {
      const ports = this._parsePorts(null);
      this.ports = ports.in.concat(ports.out);
    } else {
      const ports = this._parsePorts(options.ports);
      this.ports = ports.in.concat(ports.out);
    }

    if (isDefined(options.props) && isPlainObject(options.props)) {
      this.props = merge.recursive(true, options.props, {});
    } else {
      this.props = {};
    }

    if (notEmptyString(options.handler)) {
      this.handlerSource = options.handler;
    } else {
      this.handlerSource = null;
    }

    if (notEmptyString(options.handlerFile)) {
      this.handlerFile = options.handlerFile;
    } else {
      this.handlerFile = null;
    }

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
      type: this.type,
      name: this.name,
      ports: this._buildPorts()
    }

    const props = this._buildProps();
    if (props) {
      value.props = props;
    }

    if (!this.isNavNode) {
      if (isDefined(this.handlerFile)) {
        value.handlerFile = this.handlerFile;
      } else if (isDefined(this.handler)) {
        value.handler = this.handler;
      } else {
        value.handlerFile = null;
      }
    }

    value.canvas = this._buildCanvas();
    return value;
  }

  _buildCanvas() {
    const value = {
      position: [this.positionX, this.positionY]
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

  _parsePorts(ports) {
    const inPorts = new Set([DEFAULT_PORT]);
    const outPorts = new Set([DEFAULT_PORT]);

    if (isDefined(ports) && isPlainObject(ports)) {
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

    const result = {
      in: [...inPorts].map(p => createPort(p, GraphPortType.IN)),
      out: [...outPorts].map(p => createPort(p, GraphPortType.OUT))
    };

    return result;
  }

  _parsePosition(canvasOptions) {
    if (!isDefined(canvasOptions) || !isPlainObject(canvasOptions)) {
      return { x: 0, y: 0 };
    }

    const position = canvasOptions.position;
    if (!Array.isArray(position)) {
      return { x: 0, y: 0 };
    }

    let x = position[0];
    if (typeof x !== "number") {
      x = 0;
    }

    let y = position[1];
    if (typeof y !== "number") {
      y = 0;
    }

    return { x, y };
  }

  _parseHeaderColor(canvasOptions) {
    if (!isDefined(canvasOptions) || !isPlainObject(canvasOptions)) {
      return null;
    }

    const color = canvasOptions.color;
    if (notEmptyString(color)) {
      return color;
    }

    return null;
  }

  _getNameFromTypeOrDefault(type, id) {
    switch (type) {
      case GraphNodeType.Start:
        return localize("editor.startNode");
      case GraphNodeType.End:
        return localize("editor.endNode");
      case GraphNodeType.Error:
        return localize("editor.errorNode");
      default:
        return localize("editor.untitledNode", id);
    }
  }

  findOutPortByName(portName) {
    return this.outPorts.find(port => port.name === portName);
  }

  findInPortByName(portName) {
    return this.inPorts.find(port => port.name === portName);
  }
}

export function createNode(data) {
  return createInstance(GraphNodeModel, data);
}
