<script>
export default {
  name: 'v-editor-node-ports'
};
</script>

<script setup>
import {
  VFieldLayout,
  VLabel,
  VInput,
  VCheckbox,
  VLayout,
  VActionItem
} from '@ruleenginejs/ui';
import localize from '@/utils/localize';

const props = defineProps({
  ports: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: null
  },
  editDisabled: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['update-name', 'update-disabled', 'remove']);

function getLabel(index) {
  return index === 0 ? props.label : '';
}

function onUpdateDisabled(port, newValue) {
  emit('update-disabled', port, newValue);
}

function onUpdateName(port, newValue) {
  emit('update-name', port, newValue);
}

function onRemove(port) {
  emit('remove', port);
}

const t = localize;
</script>

<template>
  <v-field-layout v-for="(port, index) in ports" :key="port.id">
    <template #label>
      <v-label truncate>{{ getLabel(index) }}</v-label>
    </template>
    <template #value>
      <v-layout gutter="sm" h-center>
        <v-layout not-shrink>
          <v-checkbox
            :disabled="editDisabled"
            :title="t('editor.sidebar.disabled')"
            :model-value="port.disabled"
            @update:model-value="onUpdateDisabled(port, $event)"
          />
        </v-layout>
        <v-layout all-distr no-flex>
          <v-input
            :disabled="editDisabled"
            :error="port.validation.error"
            :message="port.validation.message"
            :model-value="port.name"
            @update:model-value="onUpdateName(port, $event)"
          />
        </v-layout>
        <v-layout not-shrink>
          <v-action-item
            :disabled="editDisabled"
            :title="t('editor.sidebar.removePort')"
            icon="remove"
            @click="onRemove(port)"
          />
        </v-layout>
      </v-layout>
    </template>
  </v-field-layout>
</template>
