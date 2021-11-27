import { reactive, computed, ref, onUnmounted, watch } from "vue";
import { registerActionHandler, unregisterActionHandler } from "./toolbar-actions";
import { defaultActionDefinitions } from "./toolbar-defaults";
import localize from "@/utils/localize";

const settingsActionKey = Object.freeze({
  toggleVertical: "toggleVertical",
  toggleLabel: "toggleLabel"
});

const settingsActionDefinitions = [
  {
    id: settingsActionKey.toggleLabel,
    icon: "list-selection",
    title: localize("editor.action.toggleLabel"),
    label: localize("editor.action.toggleLabel"),
    disabled: false,
    visible: true,
    order: 1000
  },
  {
    id: settingsActionKey.toggleVertical,
    icon: "gear",
    title: localize("editor.action.toggleVertical"),
    label: localize("editor.action.toggleVertical"),
    disabled: false,
    visible: true,
    order: 1010
  },
]

export default function useToolbar({
  initActions,
  initVertical,
  initShowActionLabel,
  preserveDefaultActions,
  emit
}) {
  const vertical = ref(initVertical.value);
  const showActionLabel = ref(initShowActionLabel.value);

  const actions = computed(() => {
    if (preserveDefaultActions.value) {
      return reactive(defaultActionDefinitions
        .concat(settingsActionDefinitions)
        .concat(initActions.value)
        .sort(compareAction))
    } else {
      const copy = [...initActions.value];
      return copy.sort(compareAction);
    }
  });

  registerActionHandler(settingsActionKey.toggleLabel, handleToggleLabel);
  registerActionHandler(settingsActionKey.toggleVertical, handleToggleVertical);

  watch(initVertical, () => {
    vertical.value = initVertical.value;
  })

  watch(initShowActionLabel, () => {
    showActionLabel.value = initShowActionLabel.value;
  })

  onUnmounted(() => {
    unregisterActionHandler(settingsActionKey.toggleLabel);
    unregisterActionHandler(settingsActionKey.toggleVertical);
  });

  function onActionClick(action, e) {
    emit("action-click", action, e);
  }

  function compareAction(a, b) {
    return (a.order ?? 0) - (b.order ?? 0);
  }

  function handleToggleVertical() {
    vertical.value = !vertical.value;
  }

  function handleToggleLabel() {
    showActionLabel.value = !showActionLabel.value;
  }

  return {
    actions,
    vertical,
    showActionLabel,
    onActionClick
  }
}
