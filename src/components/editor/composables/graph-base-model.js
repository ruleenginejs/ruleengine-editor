import { reactive } from "vue";

let _nextUid = 0;
export function generateUid() {
  return ++_nextUid;
}

export function updateNextUid(num) {
  _nextUid = Math.max(_nextUid, num);
}

export function createInstance(ctor, ...args) {
  const obj = reactive(new ctor(...args));
  obj._initComputed();
  obj._initWatchers();
  return obj;
}

export class GraphBaseModel {
  getValue() {
    return this._buildValue();
  }

  toJSON() {
    return this.getValue();
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  _buildValue() {
    return {};
  }

  _initComputed() { }

  _initWatchers() { }
}
