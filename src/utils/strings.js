export const EMPTY_STRING = "";

export function ucFirst(str) {
  return str ? (str[0].toUpperCase() + str.slice(1)) : str;
}
