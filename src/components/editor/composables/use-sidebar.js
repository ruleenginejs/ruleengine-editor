import { computed, ref } from "vue";
import localize from "@/utils/localize";
import { isDefined } from "@/utils/types";

export default function useSidebar({ model, propsComponents }) {
  const noActionMessage = ref(localize("editor.noSelection"));

  const selectedObjectType = computed(() => {
    return model.value.getModelType(model.value.selectedObject);
  });
  const noAction = computed(() => {
    return !isDefined(selectedObjectType.value) || selectedObjectType.value === "graph";
  });
  const propsComponentName = computed(() => {
    return propsComponents[selectedObjectType.value];
  });

  const onEdit = (editCommands) => {
    model.value.applyEdits(editCommands);
  }

  return {
    noAction,
    noActionMessage,
    propsComponentName,
    onEdit
  }
}
