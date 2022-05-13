import { computed, ref } from 'vue';
import localize from '@/utils/localize';
import { isDefined } from '@/utils/types';
import { GraphModelType } from './graph-model-util';

export default function useSidebar({ selectedObject, propsComponents, emit }) {
  const noActionMessage = ref(localize('editor.noSelection'));

  const selectedObjectType = computed(() => {
    return selectedObject.value?.type;
  });
  const noAction = computed(() => {
    return (
      !isDefined(selectedObjectType.value) ||
      selectedObjectType.value === GraphModelType.Graph
    );
  });
  const propsComponentName = computed(() => {
    return propsComponents[selectedObjectType.value];
  });

  const onEdit = editCommands => {
    emit('edit', editCommands);
  };

  return {
    noAction,
    noActionMessage,
    propsComponentName,
    onEdit
  };
}
