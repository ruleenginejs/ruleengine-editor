import logger from "./logger";
import { isPlainObject } from "./types";

export class EditCommand {
  constructor(name, payload) {
    this.name = name;
    this.payload = payload;
  }

  apply(model) {
    if (!isPlainObject(this.payload)) {
      return null;
    }
    try {
      return this.doApply(model, this.payload);
    } catch (err) {
      return this.handleError(err);
    }
  }

  // eslint-disable-next-line no-unused-vars
  doApply(model, payload) { }

  handleError(err) {
    logger.error(`Error apply command ${this.name}`, err);
    return null;
  }

  toJSON() {
    return createDefinition(this.name, this.payload);
  }

  toString() {
    return JSON.stringify(this.toJSON());
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

export function createDefinition(name, payload) {
  return {
    name,
    payload
  }
}

export function createChanges(appliedChangesCommandDef, reverseCommandDef) {
  return {
    applied: appliedChangesCommandDef,
    reverse: reverseCommandDef
  }
}

export function applyEditCommands(model, rawEditCommands) {
  const commands = createEditCommands(rawEditCommands);
  return commands.map(c => c.apply(model)).filter(val => !!val);
}

export function createEditCommands(rawEditCommands) {
  if (!Array.isArray(rawEditCommands)) {
    return [];
  }

  return rawEditCommands.map((command) => {
    if (!command) {
      return null;
    }

    return createCommand(command.name, command.payload);
  }).filter(val => !!val);
}

export function createCommand(name, payload) {
  const ctor = EditCommandsRegistry.current.getCommand(name);
  if (typeof ctor === "function") {
    return new ctor(payload);
  }
  return null;
}
