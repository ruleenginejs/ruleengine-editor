export const GraphNodeType = Object.freeze({
  Start: "start",
  End: "end",
  Error: "error",
  Single: "single",
  Composite: "composite"
});

const graphNodeTypes = Object.keys(GraphNodeType).map(key => GraphNodeType[key]);

export function validateNodeType(value) {
  return graphNodeTypes.indexOf(value) !== -1;
}

const _singlePortNodeTypes = [
  GraphNodeType.Start,
  GraphNodeType.End,
  GraphNodeType.Error
];

export function isSinglePortNodeType(type) {
  return _singlePortNodeTypes.includes(type);
}
