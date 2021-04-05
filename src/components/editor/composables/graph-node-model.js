import localize from "@/utils/localize";
import isPlainObject from "is-plain-object";
import merge from "merge";
import { reactive, ref, computed } from "vue"
import { GraphNodeType, validateNodeType } from "./graph-node-type";
import { createPort } from "./graph-port-model";
import { isDefined, notEmptyString } from "@/utils/types";
import { SelectableModel } from "./selectable-model";

const _singlePortNodeTypes = [
  GraphNodeType.Start,
  GraphNodeType.End,
  GraphNodeType.Error
];

function isSinglePortNodeType(type) {
  return _singlePortNodeTypes.includes(type);
}

export class GraphNodeModel extends SelectableModel {
  static _nextId = 0;

  constructor(options) {
    super();
    options = options || {};

    if (notEmptyString(options.id) || typeof options.id === "number") {
      this.id = ref(options.id);

      if (typeof this.id.value === "number") {
        GraphNodeModel._updateNextId(this.id.value);
      }
    } else {
      this.id = ref(++GraphNodeModel._nextId);
    }

    if (isDefined(options.type) && validateNodeType(options.type.toLowerCase())) {
      this.type = ref(options.type.toLowerCase());
    } else {
      this.type = ref(GraphNodeType.Single);
    }

    if (notEmptyString(options.name)) {
      this.name = ref(options.name);
    } else {
      this.name = ref(this._getNameFromTypeOrDefault(this.type.value, this.id.value));
    }

    if (isSinglePortNodeType(this.type.value)) {
      const ports = this._parsePorts(null);
      this.isSinglePort = ref(true);

      this.inPorts = reactive([ports.in[0]]);
      this.outPorts = reactive([ports.in[0]]);
    } else {
      const ports = this._parsePorts(options.ports);
      this.isSinglePort = ref(false);

      this.inPorts = reactive(ports.in);
      this.outPorts = reactive(ports.out);
    }

    if (isDefined(options.props) && isPlainObject(options.props)) {
      this.props = reactive(merge.recursive(true, options.props, {}));
    } else {
      this.props = reactive({});
    }

    if (notEmptyString(options.handler)) {
      this.handlerSource = ref(options.handler);
    } else {
      this.handlerSource = ref(null);
    }

    if (notEmptyString(options.handlerFile)) {
      this.handlerFile = ref(options.handlerFile)
    } else {
      this.handlerFile = ref(null);
    }

    const position = this._parsePosition(options.canvas);
    this.positionX = ref(position.x);
    this.positionY = ref(position.y);

    this.isErrorNode = ref(this.type.value === GraphNodeType.Error);
    this.headerColor = ref(this._parseHeaderColor(options.canvas));

    this.hasHandler = computed(() => {
      return isDefined(this.handlerSource.value) || isDefined(this.handlerFile.value)
    });
  }

  static _updateNextId(num) {
    GraphNodeModel._nextId = Math.max(GraphNodeModel._nextId, num);
  }

  _parsePorts(ports) {
    const inPorts = new Set(["default"]);
    const outPorts = new Set(["default"]);

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
      in: [...inPorts].map(p => createPort(p, "in")),
      out: [...outPorts].map(p => createPort(p, "out"))
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
        return "s";
      case GraphNodeType.End:
        return "e";
      case GraphNodeType.Error:
        return "error";
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
  return new GraphNodeModel(data);
}
