const _actionHandlers = {};

export function registerActionHandler(actionId, handler) {
  if (typeof handler === 'function') {
    _actionHandlers[actionId] = handler;
  }
}

export function unregisterActionHandler(actionId) {
  delete _actionHandlers[actionId];
}

export function handleAction(editorInstance, actionId, args) {
  if (!editorInstance) {
    throw new Error('Editor instance is required');
  }

  if (_actionHandlers[actionId]) {
    _actionHandlers[actionId](editorInstance, actionId, args);
  }
}
