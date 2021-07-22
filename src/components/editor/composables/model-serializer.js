import { isDefined } from "@/utils/types";
import { getModelType, GraphModelType } from "./graph-model-util";

const serializers = {
  [GraphModelType.Node]: serializeNodeModel,
  [GraphModelType.Port]: serializePortModel,
  [GraphModelType.Connection]: serializeConnectionModel
};

function serializeModel(graphModel) {
  const modelType = getModelType(graphModel);
  if (!isDefined(modelType)) {
    return null;
  }

  const serializer = serializers[modelType];
  if (!isDefined(serializer)) {
    return null;
  }

  return serializer(graphModel);
}

function serializeNodeModel(nodeModel) {
  return {
    id: nodeModel.id,
    type: GraphModelType.Node,
    name: nodeModel.name,
    nodeType: nodeModel.type,
    isNavNode: nodeModel.isNavNode,
    handlerFile: nodeModel.handlerFile
  }
}

function serializePortModel(portModel) {
  return {
    id: portModel.id,
    type: GraphModelType.Port,
    name: portModel.name,
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
