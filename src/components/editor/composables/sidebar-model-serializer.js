import { isDefined } from "@/utils/types";
import { getModelType, GraphModelType } from "./graph-model-util";

const serializers = {
  [GraphModelType.Node]: serializeNodeModel,
  [GraphModelType.Port]: serializePortModel,
  [GraphModelType.Connection]: serializeConnectionModel
};

function serializeModel(rootModel, selectedModel = null) {
  if (!isDefined(rootModel)) {
    throw new Error("Argument rootModel is required.");
  }

  const modelType = getModelType(selectedModel);
  if (!isDefined(modelType)) {
    return null;
  }

  const serializer = serializers[modelType];
  if (!isDefined(serializer)) {
    return null;
  }

  return serializer(selectedModel, rootModel);
}

function serializeNodeModel(nodeModel, rootModel) {
  const model = createNodeModel(nodeModel);
  model.ports = nodeModel.ports.map(createPortModel);
  model.connections = rootModel.getConnectionsForNode(nodeModel.id)
    .map(createConnectionModel);
  return model;
}

function serializePortModel(portModel, rootModel) {
  const model = createPortModel(portModel);
  model.otherPorts = getOtherPorts(
    rootModel.getNodeById(portModel.nodeId),
    portModel.id,
    portModel.type
  )
  return model;
}

function serializeConnectionModel(connectionModel) {
  return createConnectionModel(connectionModel);
}

function createNodeModel(nodeModel) {
  return {
    id: nodeModel.id,
    type: GraphModelType.Node,
    name: nodeModel.name,
    nodeType: nodeModel.type,
    isNavNode: nodeModel.isNavNode,
    handlerFile: nodeModel.handlerFile,
    headerColor: nodeModel.headerColor,
  }
}

function createPortModel(portModel) {
  return {
    id: portModel.id,
    type: GraphModelType.Port,
    name: portModel.name,
    nodeId: portModel.nodeId,
    portType: portModel.type,
    disabled: portModel.disabled,
    isErrorPort: portModel.isErrorPort,
  }
}

function createConnectionModel(connectionModel) {
  return {
    id: connectionModel.id,
    type: GraphModelType.Connection,
    definition: connectionModel.definition.toJSON()
  }
}

function getOtherPorts(node, excludePortId, portType) {
  if (!node) return [];
  return node.getPortsByType(portType)
    .filter(p => p.id !== excludePortId);
}

export default serializeModel;
