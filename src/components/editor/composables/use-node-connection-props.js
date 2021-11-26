import { computed } from "vue";
import { DeleteConnectionById } from "./commands/delete-connection-by-id";
import { createEditHandler } from "./edit-handler";

const connectionDirection = Object.freeze({
  IN: "in",
  OUT: "out"
})

export default function useNodeConnectionProps({ nodeModel, emit }) {
  const inFilter = getConnectionFilter(connectionDirection.IN);
  const outFilter = getConnectionFilter(connectionDirection.OUT);

  const inConnections = computed(() => nodeModel.value.connections.filter(inFilter).map(toEditModel));
  const outConnections = computed(() => nodeModel.value.connections.filter(outFilter).map(toEditModel));

  const removeConnectionHandler = createEditHandler(
    (connectionId) => DeleteConnectionById.createDef(connectionId),
    emit
  );

  function onConnectionRemove(connection) {
    removeConnectionHandler(connection.id);
  }

  function toEditModel({ id, definition }) {
    const from = createPair(definition.from.nodeId, definition.from.outPort);
    const to = createPair(definition.to.nodeId, definition.to.inPort);
    return {
      id,
      from,
      to,
      fromOptions: [{ text: from, value: from }],
      toOptions: [{ text: to, value: to }]
    }
  }

  function getConnectionFilter(direction) {
    return ({ definition }) => {
      if (direction === connectionDirection.IN) {
        return definition.to.nodeId === nodeModel.value.id;
      } else if (direction === connectionDirection.OUT) {
        return definition.from.nodeId === nodeModel.value.id;
      } else {
        return false;
      }
    };
  }

  function createPair(nodeId, portName) {
    return `${nodeId}:${portName}`;
  }

  return {
    inConnections,
    outConnections,
    onConnectionRemove
  }
}
