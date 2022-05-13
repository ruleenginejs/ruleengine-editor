import { isDefined } from '@/utils/types';
import { GraphConnectionModel } from './graph-connection-model';
import { GraphModel } from './graph-model';
import { GraphNodeModel } from './graph-node-model';
import { GraphPortModel } from './graph-port-model';

export const GraphModelType = Object.freeze({
  Graph: 'graph',
  Node: 'node',
  Port: 'port',
  Connection: 'connection'
});

export function getModelType(model) {
  if (!isDefined(model)) {
    return model;
  } else if (model instanceof GraphModel) {
    return GraphModelType.Graph;
  } else if (model instanceof GraphNodeModel) {
    return GraphModelType.Node;
  } else if (model instanceof GraphPortModel) {
    return GraphModelType.Port;
  } else if (model instanceof GraphConnectionModel) {
    return GraphModelType.Connection;
  }
  return null;
}
