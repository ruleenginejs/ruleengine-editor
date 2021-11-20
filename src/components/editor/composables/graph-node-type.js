import localize from "@/utils/localize";

export const GraphNodeType = Object.freeze({
  Start: "start",
  End: "end",
  Error: "error",
  Single: "single",
  Composite: "composite"
});

const _graphNodeTypes = Object.keys(GraphNodeType).map(key => GraphNodeType[key]);

export function validateNodeType(value) {
  return _graphNodeTypes.indexOf(value.toLowerCase()) !== -1;
}

const _navNodeTypes = [
  GraphNodeType.Start,
  GraphNodeType.End,
  GraphNodeType.Error
];

export function isNavNodeType(type) {
  return _navNodeTypes.includes(type);
}

export function getNodeTypeName(nodeType) {
  switch (nodeType) {
    case GraphNodeType.Start:
      return localize("editor.startNode");
    case GraphNodeType.End:
      return localize("editor.endNode");
    case GraphNodeType.Error:
      return localize("editor.errorNode");
    case GraphNodeType.Single:
      return localize("editor.singleNode");
    case GraphNodeType.Composite:
      return localize("editor.compositeNode");
    default:
      return localize("editor.unknownNode");
  }
}
