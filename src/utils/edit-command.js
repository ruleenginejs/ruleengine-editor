export class EditCommand {
  static _nextId = 0;

  constructor(name, payload, reversePayload) {
    this.name = name;
    this.payload = payload;
    this.reversePayload = reversePayload;
    this.uid = ++EditCommand._nextId;
  }

  // eslint-disable-next-line no-unused-vars
  apply(model) {
    throw new Error("Not implemented");
  }

  // eslint-disable-next-line no-unused-vars
  reverse(model) {
    throw new Error("Not implemented");
  }

  static getRaw(name, payload, reversePayload) {
    return {
      name,
      payload,
      reversePayload
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

    return createCommand(command.name, command.payload, command.reversePayload);
  }).filter(val => !!val);
}

export function createCommand(name, payload, reversePayload) {
  const ctor = EditCommandsRegistry.current.getCommand(name);
  if (typeof ctor === "function") {
    return new ctor(payload, reversePayload);
  }
  return null;
}
