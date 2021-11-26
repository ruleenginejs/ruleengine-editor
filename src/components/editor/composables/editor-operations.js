import { CreateNode } from "./commands/create-node";
import { getModelType, GraphModelType } from "./graph-model-util";
import { isDefined } from "@/utils/types";
import { DeleteNode } from "./commands/delete-node";
import { DeleteConnection } from "./commands/delete-connection";

export class EditorOperations {
  constructor(model) {
    this.model = model;
  }

  createNode(type, options, notify) {
    this.model.value.applyEdits([CreateNode.createDef({ ...options, type })], notify);
  }

  createNodeInCurrentViewWithOffset(type, viewport, positionOffset, options, notify) {
    options = { ...options, type };
    const x = -viewport[0] + positionOffset[0];
    const y = -viewport[1] + positionOffset[1];
    options.canvas = {
      position: [x, y]
    }
    this.createNode(type, options, notify);
  }

  deleteModelObject(modelObject, notify) {
    const modelType = getModelType(modelObject);

    if (!isDefined(modelType) || modelType === GraphModelType.Graph) {
      return;
    }

    const editOperations = [];
    switch (modelType) {
      case GraphModelType.Node:
        editOperations.push.apply(
          editOperations,
          this._deleteNodeWithConnnections(modelObject.id)
        );
        break;

      case GraphModelType.Connection:
        editOperations.push(DeleteConnection.createDef(modelObject.definition));
        break;
    }

    if (editOperations.length > 0) {
      this.model.value.applyEdits(editOperations, notify);
    }
  }

  _deleteNodeWithConnnections(nodeId) {
    const editOperations = [];
    const connections = this.model.value.getConnectionsForNode(nodeId);
    editOperations.push.apply(editOperations, connections.map(c =>
      DeleteConnection.createDef(c.definition)));
    editOperations.push(DeleteNode.createDef(nodeId));
    return editOperations;
  }
}
