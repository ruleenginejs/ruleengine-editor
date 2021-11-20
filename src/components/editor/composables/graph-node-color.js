export const GraphNodeHeaderColor = Object.freeze({
  Blue: "blue",
  Green: "green"
});

const _presetColors = Object.keys(GraphNodeHeaderColor)
  .map(key => GraphNodeHeaderColor[key]);

export function isColorFromPreset(color) {
  return _presetColors.indexOf(color) !== -1;
}

export function getColorPreset() {
  return _presetColors;
}
