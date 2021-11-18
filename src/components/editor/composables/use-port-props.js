import { computed, ref } from "vue";
import localize from "@/utils/localize";
import { createEditHandler } from "./edit-handler";
import { ChangePortName } from "./commands/change-port-name";

export default function usePortProps({ portModel, emit, editDelay }) {
  const sectionName = ref(localize("editor.sidebar.portSection"));

  const editNameHandler = createEditHandler(
    (val) => ChangePortName.createDef(
      portModel.value.nodeId,
      portModel.value.id,
      val
    ),
    emit, editDelay.value);

  const editName = computed({
    get: () => portModel.value.name,
    set: (val) => { editNameHandler(val); }
  });

  return {
    sectionName,
    editName
  }
}
