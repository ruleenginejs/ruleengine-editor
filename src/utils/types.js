import { isPlainObject as _isPlainObject } from "is-plain-object";

export function isDefined(value) {
  return value !== null && value !== undefined;
}

export function notEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

export function isPlainObject(value) {
  return isDefined(value) && _isPlainObject(value);
}
