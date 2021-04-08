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
