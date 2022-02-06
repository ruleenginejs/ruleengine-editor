export const EMPTY_STRING = "";

export function ucFirst(str) {
  return str ? (str[0].toUpperCase() + str.slice(1)) : str;
}

export function spltCamelCase(str, separator = " ") {
  return str ? str.replace(/([a-z0-9])([A-Z])/g, `$1${separator}$2`) : str;
}
