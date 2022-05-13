import logger from './logger';
import { isPlainObject } from './types';

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
      return this.doError(err);
    }
  }

  // eslint-disable-next-line no-unused-vars
  doApply(model, payload) {}

  doError(err) {
    logger.error(`Error apply command: ${this.name}`, err);
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
    };

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
  };
}

export function createChanges(appliedCommandDef, reverseCommandDef) {
  return {
    applied: appliedCommandDef,
    reverse: reverseCommandDef
  };
}

export function applyEditCommands(model, editCommandDefs) {
  const commands = createEditCommands(editCommandDefs);
  return commands
    .map(c => c.apply(model))
    .flat()
    .filter(val => !!val);
}

export function createEditCommands(editCommandDefs) {
  if (!Array.isArray(editCommandDefs)) {
    return [];
  }

  return editCommandDefs
    .map(command => {
      if (!command) {
        return null;
      }

      return createCommand(command.name, command.payload);
    })
    .filter(val => !!val);
}

export function createCommand(name, payload) {
  const ctor = EditCommandsRegistry.current.getCommand(name);
  if (typeof ctor === 'function') {
    return new ctor(payload);
  }
  return null;
}
