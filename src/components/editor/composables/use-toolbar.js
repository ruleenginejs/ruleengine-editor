import { reactive, computed, ref } from "vue";
import { defaultActionDefinitions } from "./toolbar-defaults";

export default function useToolbar({
  initActions,
  initVertical,
  preserveDefaultActions,
  emit
}) {
  const vertical = ref(initVertical.value);
  const actions = computed(() => {
    if (preserveDefaultActions.value) {
      return reactive(defaultActionDefinitions.concat(initActions.value))
    } else {
      return initActions.value;
    }
  });

  function onActionClick(action, e) {
    emit("action-click", action, e);
  }

  return {
    actions,
    vertical,
    onActionClick
  }
}
