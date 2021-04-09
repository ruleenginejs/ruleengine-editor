import isPlainObject from "is-plain-object";
import { isDefined } from "./types";

export class EditCommand {
  static _nextId = 0;

  constructor(name, payload, reversePayload) {
    this.name = name;
    this.payload = payload;
    this.reversePayload = reversePayload;
    this.uid = ++EditCommand._nextId;
  }

  apply(model) {
    return this._execute(model, this.payload);
  }

  reverse(model) {
    return this._execute(model, this.reversePayload);
  }

  _execute(model, payload) {
    if (isDefined(payload) && isPlainObject(payload)) {
      return this.doExecute(model, payload);
    }
    return null;
  }

  // eslint-disable-next-line no-unused-vars
  doExecute(model, payload) { }

  static getRaw(name, payload, reversePayload) {
    return {
      name,
      payload,
      reverse: reversePayload
    }
  }
}

export class EditCommandsRegistry {
  static current = new EditCommandsRegistry();

  constructor() {
    this.commands = new Map();
  }

  registerCommand(commandId, handler) {
    this.commands.set(commandId, handler);

    const toUnbind = () => {
      this.commands.delete(commandId);
    }

    return toUnbind;
  }

  getCommand(commandId) {
    return this.commands.get(commandId);
  }

  destroy() {
    this.commands.clear();
  }
}

export function applyEditCommands(model, rawEditCommands) {
  const commands = createEditCommands(rawEditCommands);
  return commands.map(c => c.apply(model)).filter(val => !!val);
}

export function applyReverseEditCommands(model, rawEditCommands) {
  const commands = createEditCommands(rawEditCommands);
  return commands.map(c => c.reverse(model)).filter(val => !!val);
}

export function createEditCommands(rawEditCommands) {
  if (!Array.isArray(rawEditCommands)) {
    return [];
  }

  return rawEditCommands.map((command) => {
    if (!command) {
      return null;
    }

    return createCommand(command.name, command.payload, command.reverse);
  }).filter(val => !!val);
}

export function createCommand(name, payload, reversePayload) {
  const ctor = EditCommandsRegistry.current.getCommand(name);
  if (typeof ctor === "function") {
    return new ctor(payload, reversePayload);
  }
  return null;
}
