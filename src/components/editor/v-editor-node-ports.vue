<script>
export default {
  name: "v-editor-node-ports"
}
</script>

<script setup>
import {
  VFieldLayout,
  VLabel,
  VInput,
  VCheckbox,
  VLayout,
  VActionItem
} from "@ruleenginejs/ruleengine-ui";

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
const emit = defineEmits([
  "update-name",
  "update-disabled",
  "remove"
]);

function getLabel(index) {
  return index === 0 ? props.label : "";
}

function onUpdateDisabled(port, newValue) {
  emit("update-disabled", port, newValue);
}

function onUpdateName(port, newValue) {
  emit("update-name", port, newValue);
}

function onRemove(port) {
  emit("remove", port);
}
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
            :model-value="port.disabled"
            @update:model-value="onUpdateDisabled(port, $event)"
          />
        </v-layout>
        <v-layout all-distr no-flex>
          <v-input
            :disabled="editDisabled"
            :model-value="port.name"
            @update:model-value="onUpdateName(port, $event)"
          />
        </v-layout>
        <v-layout not-shrink>
          <v-action-item :disabled="editDisabled" icon="remove" @click="onRemove(port)" />
          <div @click="onRemove(port)">Rem</div>
        </v-layout>
      </v-layout>
    </template>
  </v-field-layout>
</template>
