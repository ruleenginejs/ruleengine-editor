export function isDefined(value) {
  return value !== null && value !== undefined;
}

export function notEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}
