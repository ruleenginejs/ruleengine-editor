<script>
export default {
  name: "v-editor-node-connections"
}
</script>

<script setup>
import {
  VFieldLayout,
  VLayout,
  VActionItem,
  VSelectBox
} from "@ruleenginejs/ruleengine-ui";

defineProps({
  connections: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(["remove"]);

function onRemove(connection) {
  emit("remove", connection);
}
</script>

<template>
  <v-field-layout v-for="connection in connections" :key="connection.id">
    <template #label>
      <v-select-box :model-value="connection.from" :items="connection.fromOptions" />
    </template>
    <template #value>
      <v-layout gutter="sm" h-center>
        <v-layout all-distr no-flex>
          <v-select-box :model-value="connection.to" :items="connection.toOptions" />
        </v-layout>
        <v-layout not-shrink>
          <v-action-item icon="remove" @click="onRemove(connection)" />
          <div @click="onRemove(port)">Rem</div>
        </v-layout>
      </v-layout>
    </template>
  </v-field-layout>
</template>
