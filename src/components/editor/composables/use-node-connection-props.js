import { computed, ref, reactive } from "vue";

export default function useNodeConnectionProps({ nodeModel, emit, editDelay }) {
  const connections = reactive([]);

  function onConnectionRemove(connection) {

  }

  return {
    connections,
    onConnectionRemove
  }
}
