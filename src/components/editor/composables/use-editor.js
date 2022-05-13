import { markRaw } from 'vue';
import Editor from './editor';

export default function useEditor(options) {
  return markRaw(new Editor(options));
}
