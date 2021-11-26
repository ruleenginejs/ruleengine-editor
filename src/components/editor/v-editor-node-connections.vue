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
  VSelectBox,
  VLabel
} from "@ruleenginejs/ruleengine-ui";
import localize from "@/utils/localize";

defineProps({
  label: {
    type: String,
    default: null
  },
  connections: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(["remove"]);

function onRemove(connection) {
  emit("remove", connection);
}

const t = localize;
</script>

<template>
  <v-field-layout vertical>
    <template #value>
      <v-field-layout v-if="label">
        <template #label>
          <v-label truncate>{{ label }}</v-label>
        </template>
      </v-field-layout>
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
              <v-action-item
                icon="remove"
                :title="t('editor.title.removeConnection')"
                @click="onRemove(connection)"
              />
            </v-layout>
          </v-layout>
        </template>
      </v-field-layout>
    </template>
  </v-field-layout>
</template>
