const _colorPreset = [
  "blue",
  "brown",
  "green",
  "indigo",
  "orange",
  "pink",
  "purple",
  "red",
  "teal",
  "yellow"
];

const _colorPresetMap = _colorPreset.reduce((res, val) => {
  res[val] = true;
  return res;
}, {});

export function isColorFromPreset(colorName) {
  return _colorPresetMap[colorName];
}

export function getColorPreset() {
  return _colorPreset;
}
