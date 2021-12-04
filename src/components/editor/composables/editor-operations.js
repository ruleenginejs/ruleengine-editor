import { CreateNode } from "./commands/create-node";
import { getModelType, GraphModelType } from "./graph-model-util";
import { isDefined } from "@/utils/types";
import { DeleteNode } from "./commands/delete-node";
import { DeleteConnection } from "./commands/delete-connection";
import { DeletePort } from "./commands/delete-port";
import { DeleteConnectionByPort } from "./commands/delete-connection-by-port";

const POSITION_TOLERANCE = 0.01;

export class EditorOperations {
  constructor(model) {
    this.model = model;
  }

  createNode(type, data, notify) {
    this.model.value.applyEdits([CreateNode.createDef({ ...data, type })], notify);
  }

  createNodeInCurrentViewWithOffset(type, viewport, positionOffset, data, notify) {
    data = { ...data, type };
    const x = -viewport[0] + positionOffset[0];
    const y = -viewport[1] + positionOffset[1];
    data.canvas = {
      position: [x, y]
    }
    this.createNode(type, data, notify);
  }

  createNodeInCurrentViewWithCascade(type, viewport, startOffset, cascadeOffset, data, notify) {
    data = { ...data, type };
    let x = -viewport[0] + startOffset[0];
    let y = -viewport[1] + startOffset[1];

    while (this.model.value.nodeExistsByPosition(x, y, POSITION_TOLERANCE)) {
      x += cascadeOffset[0];
      y += cascadeOffset[1];
    }
    data.canvas = {
      position: [x, y]
    }
    this.createNode(type, data, notify);
  }

  newNodeInCurrentViewMousePosition(canvasInstance, type, mousePoint, data, notify) {
    const containerBounds = canvasInstance.getContainerBounds();
    const containerPoint = canvasInstance.mouseEventToContainerPoint({
      clientX: mousePoint.x,
      clientY: mousePoint.y
    });
    if (containerBounds.contains(containerPoint)) {
      const layerPoint = canvasInstance.containerPointToLayerPoint(containerPoint);

      data = { ...data, type };
      data.canvas = {
        position: [layerPoint.x, layerPoint.y]
      }
      this.createNode(type, data, notify);
    }
  }

  canDeleteModelObject(modelObject) {
    const modelType = getModelType(modelObject);
    return isDefined(modelType) && modelType !== GraphModelType.Graph;
  }

  deleteModelObject(modelObject, notify) {
    if (!this.canDeleteModelObject(modelObject)) {
      return;
    }

    const modelType = getModelType(modelObject);
    const editOperations = [];
    switch (modelType) {
      case GraphModelType.Node:
        editOperations.push.apply(editOperations, this._deleteNodeWithConnnections(modelObject.id));
        break;
      case GraphModelType.Connection:
        editOperations.push(DeleteConnection.createDef(modelObject.definition));
        break;
      case GraphModelType.Port:
        editOperations.push(DeleteConnectionByPort.createDef(modelObject.nodeId, modelObject.id));
        editOperations.push(DeletePort.createDef(modelObject.nodeId, modelObject.id));
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
