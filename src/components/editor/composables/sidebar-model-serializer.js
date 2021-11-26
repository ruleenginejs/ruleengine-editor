import { isDefined } from "@/utils/types";
import { getModelType, GraphModelType } from "./graph-model-util";

const serializers = {
  [GraphModelType.Node]: serializeNodeModel,
  [GraphModelType.Port]: serializePortModel,
  [GraphModelType.Connection]: serializeConnectionModel
};

function serializeModel(selectedModel, rootModel = null) {
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

function serializeNodeModel(nodeModel, rootModel = null) {
  return {
    id: nodeModel.id,
    type: GraphModelType.Node,
    name: nodeModel.name,
    nodeType: nodeModel.type,
    isNavNode: nodeModel.isNavNode,
    handlerFile: nodeModel.handlerFile,
    headerColor: nodeModel.headerColor,
    ports: nodeModel.ports.map(serializePortModel),
    connections: rootModel.getConnectionsForNode(nodeModel.id)
      .map(serializeConnectionModel)
  }
}

function serializePortModel(portModel) {
  return {
    id: portModel.id,
    type: GraphModelType.Port,
    name: portModel.name,
    nodeId: portModel.nodeId,
    portType: portModel.type,
    disabled: portModel.disabled,
    isErrorPort: portModel.isErrorPort
  }
}

function serializeConnectionModel(connectionModel) {
  return {
    id: connectionModel.id,
    type: GraphModelType.Connection,
    definition: connectionModel.definition.toJSON()
  }
}

export default serializeModel;
