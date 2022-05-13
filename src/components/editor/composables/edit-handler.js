import { isDefined } from '@/utils/types';
import debounce from 'debounce';

function createHandler(func, delay = null) {
  if (!isDefined(delay)) {
    return func;
  } else {
    return debounce(func, delay);
  }
}

function notifyEdit(editCommand, emit) {
  emit('edit', Array.isArray(editCommand) ? editCommand : [editCommand]);
}

export function createEditHandler(func, emit, editDelay = null) {
  return createHandler((...args) => notifyEdit(func(...args), emit), editDelay);
}
