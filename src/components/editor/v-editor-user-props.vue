<script>
export default {
  name: 'v-editor-user-props'
};
</script>

<script setup>
import { toRefs } from 'vue';
import {
  VFieldLayout,
  VLabel,
  VInput,
  VCheckbox,
  VSelectBox
} from '@ruleenginejs/ui';

const props = defineProps({
  fields: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update']);

const { fields } = toRefs(props);

function isInput({ type }) {
  return type === 'string';
}

function isCheckbox({ type }) {
  return type === 'boolean';
}

function isEnum({ type, enumOptions }) {
  return type === 'string' && enumOptions.length > 0;
}

function onUpdate(field, newValue) {
  emit('update', field, newValue);
}
</script>

<template>
  <v-field-layout v-for="field in fields" :key="field.prop">
    <template #label>
      <v-label truncate>{{ field.label }}</v-label>
    </template>
    <template #value>
      <v-select-box
        v-if="isEnum(field)"
        :items="field.enumOptions"
        :model-value="field.value"
        @update:model-value="onUpdate(field, $event)"
      />
      <v-input
        v-else-if="isInput(field)"
        :model-value="field.value"
        @update:model-value="onUpdate(field, $event)"
      />
      <v-checkbox
        v-else-if="isCheckbox(field)"
        :model-value="field.value"
        @update:model-value="onUpdate(field, $event)"
      />
    </template>
  </v-field-layout>
</template>
