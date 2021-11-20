import { computed, ref } from "vue";
import { GraphPortType } from "./graph-port-type";

export default function useNodePortProps({ nodeModel, emit, editDelay }) {
  const canShowPorts = ref(true);
  const portEditDisabled = computed(() => nodeModel.value.isNavNode);

  const inPorts = computed(() => nodeModel.value.ports.filter(
    p => p.portType === GraphPortType.IN));
  const outPorts = computed(() => nodeModel.value.ports.filter(
    p => p.portType === GraphPortType.OUT));

  function onUpdatePortName(port, newValue) {
  }

  function onUpdatePortDisabled(port, newValue) {
  }

  function onPortRemove(port, newValue) {
  }

  return {
    inPorts,
    outPorts,
    canShowPorts,
    portEditDisabled,
    onUpdatePortName,
    onUpdatePortDisabled,
    onPortRemove
  }
}
