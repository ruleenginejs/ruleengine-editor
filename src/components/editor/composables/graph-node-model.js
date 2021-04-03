import localize from "@/utils/localize";
import { isPlainObject } from "is-plain-object";
import merge from "merge";
import { reactive, ref } from "vue"
import { GraphNodeType, validateNodeType } from "./graph-node-type";
import { createPort } from "./graph-port-model";
import { isDefined } from "./types";

let _nextId = 0;

function notEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

export class GraphNodeModel {
  constructor(options) {
    debugger;
    options = options || {};

    if (notEmptyString(options.id) || typeof options.id === "number") {
      this.id = ref(options.id);
    } else {
      this.id = ref(++_nextId);
    }

    if (isDefined(options.type) && validateNodeType(options.type)) {
      this.type = ref(options.type);
    } else {
      this.type = ref(GraphNodeType.Single);
    }

    if (notEmptyString(options.name)) {
      this.name = ref(options.name);
    } else {
      this.name = ref(localize("editor.untitledNode", this.id.value));
    }

    const ports = this._parsePorts(options.ports);
    this.inPorts = reactive(ports.in);
    this.outPorts = reactive(ports.out);

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
  }

  _parsePorts(ports) {
    debugger;
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
}

export function createNode(data) {
  return new GraphNodeModel(data);
}
