import { CreateNewConnection } from './commands/create-new-connection';
import { ConnectionDefinition } from './connection-definition';
import { GraphPortType } from './graph-port-type';

export function createNewConnection(model, from, to) {
  if (!from || !to) return;

  from = { ...from };
  to = { ...to };

  from.node = model.getNodeById(from.nodeId);
  if (!from.node) return;

  to.node = model.getNodeById(to.nodeId);
  if (!to.node) return;

  if (from.portId) {
    from.port = from.node.getPortById(from.portId);
  }

  if (to.portId) {
    to.port = to.node.getPortById(to.portId);
  }

  if (!from.port && !to.port) {
    from.port = from.node.getDefaultOutPort();
  }

  if (!from.port) {
    from.port = _pickPortFor(from.node, to.port);
  }

  if (!to.port) {
    to.port = _pickPortFor(to.node, from.port);
  }

  if (!from.port || !to.port) {
    return;
  }

  if (from.port.type === GraphPortType.IN) {
    const tmp = from;
    from = to;
    to = tmp;
  }

  const connectionDef = new ConnectionDefinition(
    {
      nodeId: from.node.id,
      outPort: from.port.name
    },
    {
      nodeId: to.node.id,
      inPort: to.port.name
    }
  );

  model.applyEdits([CreateNewConnection.createDef(connectionDef)]);
}

function _pickPortFor(node, targetPort) {
  if (targetPort.type === GraphPortType.IN) {
    return node.getDefaultOutPort();
  } else {
    return node.getDefaultInPort();
  }
}
