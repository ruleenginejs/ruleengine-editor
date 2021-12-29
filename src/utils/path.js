export const PACKAGE_PREFIX = "~";
export const RELATIVE_PREFIX = "./";

const BACKSLASH = new RegExp("\\\\", 'g');
// eslint-disable-next-line no-useless-escape
const SPLIT_DEVICE_RE = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

export function replaceBackslash(path) {
  return path.replace(BACKSLASH, "/");
}

export function posixIsAbsolute(path) {
  return path.charAt(0) === '/';
}

function win32StatPath(path) {
  const result = SPLIT_DEVICE_RE.exec(path);
  const device = result[1] || '';
  const isUnc = !!device && device[1] !== ':';
  return {
    device: device,
    isUnc: isUnc,
    isAbsolute: isUnc || !!result[2],
    tail: result[3]
  };
}

export function winIsAbsolute(path) {
  return win32StatPath(path).isAbsolute;
}
