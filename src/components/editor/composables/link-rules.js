import { GraphNodeType } from "./graph-node-type";
import { GraphPortType } from "./graph-port-type";

export function validateLink(model, from, to) {
  if (!from || !to) return false;

  const fromNode = model.getNodeById(from.nodeId);
  if (!fromNode) return false;

  const toNode = model.getNodeById(to.nodeId);
  if (!toNode) return false;

  if (fromNode.isNavNode && toNode.isNavNode) {
    return _validateLinkBetweenNavNodes(model,
      { node: fromNode, portId: from.portId },
      { node: toNode, portId: to.portId }
    );
  }

  if (fromNode.isNavNode || toNode.isNavNode) {
    return _validateLinkBetweenNavAndStepNodes(model,
      { node: fromNode, portId: from.portId },
      { node: toNode, portId: to.portId }
    );
  }

  if (!fromNode.isNavNode && !toNode.isNavNode) {
    return _validateLinkBetweenStepNodes(model,
      { node: fromNode, portId: from.portId },
      { node: toNode, portId: to.portId }
    );
  }

  return false;
}

function _validateLinkBetweenNavNodes(model, from, to) {
  if (_isReverseDirection(from.node, to.node)) {
    const tmp = from;
    from = to;
    to = tmp;
  }

  if (from.node.type === to.node.type) {
    return false;
  }

  if (!_isEndNode(to.node)) {
    return false;
  }

  if (model.connectionExists(from.node.id, from.portId)) {
    return false;
  }

  return true;
}

function _validateLinkBetweenNavAndStepNodes(model, from, to) {
  if (from.portId) {
    from.port = from.node.getPortById(from.portId);
    if (!from.port) return false;
  }

  if (to.portId) {
    to.port = to.node.getPortById(to.portId);
    if (!to.port) return false;
  }

  if (to.node.isNavNode) {
    const tmp = from;
    from = to;
    to = tmp;
  }

  if (_isStartOrErrorNode(from.node)) {
    if (!to.port) {
      to.port = to.node.getDefaultInPort();
    }

    if (!to.port) {
      return false;
    }

    if (to.port.type === GraphPortType.OUT) {
      return false;
    }

    if (model.connectionExists(from.node.id, from.portId)) {
      return false;
    }
  } else if (_isEndNode(from.node)) {
    if (!to.port) {
      to.port = to.node.getDefaultOutPort();
    }

    if (!to.port) {
      return false;
    }

    if (to.port.type === GraphPortType.IN) {
      return false;
    }
  }

  return true;
}

function _validateLinkBetweenStepNodes(model, from, to) {
  if (from.portId) {
    from.port = from.node.getPortById(from.portId);
    if (!from.port) return false;
  }

  if (to.portId) {
    to.port = to.node.getPortById(to.portId);
    if (!to.port) return false;
  }

  if (from.port && to.port) {
    if (!_validatePorts(model, from, to, false)) {
      return false;
    }
  } else if (!from.port && to.port) {
    if (to.port.type === GraphPortType.IN) {
      from.port = from.node.getDefaultOutPort();
    } else {
      from.port = from.node.getDefaultInPort();
    }

    if (!from.port) {
      return false;
    }

    if (!_validatePorts(model, from, to)) {
      return false;
    }
  } else if (from.port && !to.port) {
    if (from.port.type === GraphPortType.IN) {
      to.port = to.node.getDefaultOutPort();
    } else {
      to.port = to.node.getDefaultInPort();
    }

    if (!to.port) {
      return false;
    }

    if (!_validatePorts(model, from, to)) {
      return false;
    }
  } else {
    from.port = from.node.getDefaultOutPort();
    if (!from.port) return false;

    to.port = to.node.getDefaultInPort();
    if (!to.port) return false;

    if (!_validatePorts(model, from, to)) {
      return false;
    }
  }

  return true;
}

function _validatePorts(model, from, to, selfNode = true) {
  if (selfNode && from.node.id === to.node.id) {
    return false;
  }

  if (from.port.id === to.port.id) {
    return false;
  }

  if (from.port.type === to.port.type) {
    return false;
  }

  if (_isOutConnectionExists(model, from, to)) {
    return false;
  }

  return true;
}

function _isOutConnectionExists(model, from, to) {
  if (from.port.type === GraphPortType.IN) {
    const tmp = from;
    from = to;
    to = tmp;
  }

  return model.connectionExists(from.node.id, from.port.id, GraphPortType.OUT);
}

function _isReverseDirection(fromNode, toNode) {
  if (_isEndNode(fromNode)) {
    return true;
  }
  if (_isSingleOrCompositeNode(fromNode) && _isStartOrErrorNode(toNode)) {
    return true;
  }
  return false;
}

function _isStartOrErrorNode(node) {
  return _isStartNode(node) || _isErrorNode(node);
}

function _isSingleOrCompositeNode(node) {
  return _isSingleNode(node) || _isCompositeNode(node);
}

function _isStartNode(node) {
  return node.type === GraphNodeType.Start;
}

function _isErrorNode(node) {
  return node.type === GraphNodeType.Error;
}

function _isEndNode(node) {
  return node.type === GraphNodeType.End;
}

function _isSingleNode(node) {
  return node.type === GraphNodeType.Single;
}

function _isCompositeNode(node) {
  return node.type === GraphNodeType.Composite;
}
