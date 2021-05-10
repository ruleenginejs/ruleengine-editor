export const GraphNodeType = Object.freeze({
  Start: "start",
  End: "end",
  Error: "error",
  Single: "single",
  Composite: "composite"
});

const graphNodeTypes = Object.keys(GraphNodeType).map(key => GraphNodeType[key]);

export function validateNodeType(value) {
  return graphNodeTypes.indexOf(value.toLowerCase()) !== -1;
}

const _navNodeTypes = [
  GraphNodeType.Start,
  GraphNodeType.End,
  GraphNodeType.Error
];

export function isNavNodeType(type) {
  return _navNodeTypes.includes(type);
}
