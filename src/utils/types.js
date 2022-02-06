import { isPlainObject as _isPlainObject } from "is-plain-object";

export function isDefined(value) {
  return value !== null && value !== undefined;
}

export function notEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

export function emptyString(value) {
  return !notEmptyString(value);
}

export function isString(value) {
  return typeof value === "string";
}

export function isBoolean(value) {
  return typeof value === "boolean";
}

export function isPlainObject(value) {
  return isDefined(value) && _isPlainObject(value);
}
