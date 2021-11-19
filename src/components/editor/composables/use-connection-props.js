import { computed, ref } from "vue";
import localize from "@/utils/localize";

export default function useConnectionProps({ connectionModel }) {
  const sectionName = ref(localize("editor.sidebar.connectionSection"));

  function createPair(nodeId, portName) {
    return `${nodeId}:${portName}`;
  }

  const editFromNode = computed({
    get: () => {
      const { from } = connectionModel.value.definition;
      return createPair(from.nodeId, from.outPort);
    },
    set: () => { }
  });

  const editToNode = computed({
    get: () => {
      const { to } = connectionModel.value.definition;
      return createPair(to.nodeId, to.inPort);
    },
    set: () => { }
  });

  const fromNodeOptions = computed(() => {
    const { from } = connectionModel.value.definition;
    const value = createPair(from.nodeId, from.outPort);
    return [
      {
        text: value,
        value
      }
    ]
  });

  const toNodeOptions = computed(() => {
    const { to } = connectionModel.value.definition;
    const value = createPair(to.nodeId, to.inPort);
    return [
      {
        text: value,
        value
      }
    ]
  });

  return {
    sectionName,
    editFromNode,
    editToNode,
    fromNodeOptions,
    toNodeOptions
  }
}
