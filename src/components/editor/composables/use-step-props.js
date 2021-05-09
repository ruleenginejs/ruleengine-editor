import localize from "@/utils/localize";
import { computed, ref } from "vue";
import { GraphNodeType } from "./graph-node-type";

export default function useStepProps({ nodeModel }) {
  const sectionName = computed(() => {
    return localize("editor.sidebar.nodeTitle", nodeModel.value.getTypeName());
  });

  const canShowName = computed(() => !nodeModel.value.isNavNode);
  const canShowHandler = computed(() => nodeModel.value.type === GraphNodeType.Single);
  const canShowPorts = computed(() => !nodeModel.value.isNavNode);
  const canShowConnections = ref(true);
  const canShowUserProps = computed(() => nodeModel.value.type === GraphNodeType.Single);

  return {
    sectionName,
    canShowName,
    canShowHandler,
    canShowPorts,
    canShowConnections,
    canShowUserProps,
    localize
  }
}
