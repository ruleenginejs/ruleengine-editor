import { computed, watch, ref, onUnmounted } from "vue";
import debounce from "debounce";
import { isDefined } from "@/utils/types";

export default function useNodeUserPropsConfig({ editScriptFile, provider }) {
  const config = ref({});
  const updateDelay = computed(() => provider.value?.getUserPropsUpdateDelay?.());
  const updateConfigHandler = computed(() =>
    isDefined(updateDelay.value)
      ? debounce(updateConfig, updateDelay.value)
      : updateConfig
  );

  onUnmounted(() => {
    if (updateConfigHandler.value.clear) {
      updateConfigHandler.value.clear();
    }
  });

  watch(editScriptFile, (newValue) => {
    updateConfigHandler.value(newValue);
  });

  async function updateConfig(scriptFile) {
    const getUserPropsConfig = provider.value?.getUserPropsConfig;
    if (getUserPropsConfig) {
      config.value = await getUserPropsConfig(scriptFile);
    }
  }

  function onRefreshUserPropsConfig() {
    updateConfig(editScriptFile.value);
  }

  onRefreshUserPropsConfig();

  return {
    userPropsConfig: config,
    onRefreshUserPropsConfig
  }
}
