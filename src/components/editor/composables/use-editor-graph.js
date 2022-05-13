import { markRaw } from 'vue';
import EditorGraph from './editor-graph';

export default function useEditorGraph(options) {
  return markRaw(new EditorGraph(options));
}
