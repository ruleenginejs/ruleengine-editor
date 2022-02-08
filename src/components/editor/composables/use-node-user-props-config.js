import { computed, watch, ref, onUnmounted, toRaw } from "vue";
import debounce from "debounce";
import { isDefined } from "@/utils/types";
import { createEditHandler } from "./edit-handler";
import { ChangeNodeUserProp } from "./commands/change-node-user-prop";

export default function useNodeUserPropsConfig({ nodeModel, editScriptFile, provider, emit }) {
  const propsConfig = ref({});
  const updateDelay = computed(() => provider.value?.getUserPropsUpdateDelay?.());
  const updateConfigHandler = computed(() =>
    isDefined(updateDelay.value)
      ? debounce(updateConfigAndResetProps, updateDelay.value)
      : updateConfigAndResetProps
  );

  const batchChangePropHandler = createEditHandler((params) =>
    params.map(({ nodeId, propName, value }) =>
      ChangeNodeUserProp.createDef(nodeId, propName, value)),
    emit
  );

  onUnmounted(() => {
    if (updateConfigHandler.value.clear) {
      updateConfigHandler.value.clear();
    }
  });

  watch(editScriptFile, (newValue) => {
    updateConfigHandler.value(newValue);
  });

  function updateConfigAndResetProps(scriptFile) {
    resetProps();
    updateConfig(scriptFile);
  }

  async function updateConfig(scriptFile) {
    const getUserPropsConfig = provider.value?.getUserPropsConfig;
    if (getUserPropsConfig) {
      propsConfig.value = await getUserPropsConfig(scriptFile);
    }
  }

  function resetProps() {
    const nodeId = nodeModel.value.id;
    const commandParams = Object.keys(toRaw(propsConfig.value)).map(key => ({
      nodeId,
      propName: key,
      value: undefined
    }));
    if (commandParams.length > 0) {
      batchChangePropHandler(commandParams);
    }
  }

  updateConfig(editScriptFile.value);

  return {
    userPropsConfig: propsConfig,
    resetUserProps: resetProps
  }
}
