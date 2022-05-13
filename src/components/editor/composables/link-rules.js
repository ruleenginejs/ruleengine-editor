import { GraphNodeType } from './graph-node-type';
import { GraphPortType } from './graph-port-type';

export function validateLink(model, from, to) {
  if (!from || !to) return false;
  from = { ...from };
  to = { ...to };

  from.node = model.getNodeById(from.nodeId);
  if (!from.node) return false;

  to.node = model.getNodeById(to.nodeId);
  if (!to.node) return false;

  if (_isStartOrErrorNode(from.node) && _isStartOrErrorNode(to.node)) {
    return false;
  }

  if (
    from.node.isNavNode &&
    to.node.isNavNode &&
    from.node.type === to.node.type
  ) {
    return false;
  }

  if (from.node.id === to.node.id) {
    return false;
  }

  if (!from.portId && !to.portId) {
    from.port = from.node.getDefaultOutPort();
  }

  if (from.portId) {
    from.port = from.node.getPortById(from.portId);
    if (!from.port) return false;
  }

  if (to.portId) {
    to.port = to.node.getPortById(to.portId);
    if (!to.port) return false;
  }

  if (!from.port) {
    if (to.port.type === GraphPortType.IN) {
      from.port = from.node.getDefaultOutPort();
    } else {
      from.port = from.node.getDefaultInPort();
    }
  }

  if (!to.port) {
    if (from.port.type === GraphPortType.IN) {
      to.port = to.node.getDefaultOutPort();
    } else {
      to.port = to.node.getDefaultInPort();
    }
  }

  if (!from.port || !to.port) {
    return false;
  }

  if (from.port.id === to.port.id) {
    return false;
  }

  if (from.port.type === to.port.type) {
    return false;
  }

  if (from.port.type === GraphPortType.IN) {
    const tmp = from;
    from = to;
    to = tmp;
  }

  if (model.connectionExists(from.node.id, from.port.id, GraphPortType.OUT)) {
    return false;
  }

  return true;
}

function _isStartOrErrorNode(node) {
  return _isStartNode(node) || _isErrorNode(node);
}

function _isStartNode(node) {
  return node.type === GraphNodeType.Start;
}

function _isErrorNode(node) {
  return node.type === GraphNodeType.Error;
}
