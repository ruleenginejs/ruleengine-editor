import { isDefined } from './types';
import messages from './localization/messages.en.json';

export default (key, ...args) => {
  if (!isDefined(messages[key])) {
    return key;
  }
  return format(messages[key], ...args);
};

function format(str, ...args) {
  if (typeof str === 'string') {
    return args.reduce((str, arg, idx) => str.replace(`{${idx}}`, arg), str);
  }
  return str;
}
