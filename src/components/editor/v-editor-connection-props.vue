<script>
export default {
  name: "v-editor-connection-props"
};
</script>

<script setup>
import { toRefs } from "vue";
import useConnectionProps from './composables/use-connection-props';
import localize from "@/utils/localize";
import {
  VSidebarSection,
  VFieldset,
  VFieldLayout,
  VLabel,
  VSelectBox
} from "@ruleenginejs/ruleengine-ui";

const props = defineProps({
  model: {
    type: Object,
    required: true
  },
  editDelay: {
    type: Number,
    default: null
  }
})
const emit = defineEmits(["edit"])

const { model, editDelay } = toRefs(props);
const {
  sectionName,
  editFromNode,
  editToNode,
  fromNodeOptions,
  toNodeOptions
} = useConnectionProps({
  connectionModel: model,
  emit,
  editDelay
});

const t = localize;
</script>

<template>
  <v-sidebar-section
    :title="sectionName"
    header-compact
    header-strong
    expand
    :header-border="true"
    :bottom-border="false"
  >
    <v-fieldset :label="t('editor.sidebar.attributes')" b-border>
      <v-field-layout>
        <template #label>
          <v-label truncate>{{ t('editor.hint.fromNode') }}</v-label>
        </template>
        <template #value>
          <v-select-box v-model="editFromNode" :items="fromNodeOptions" />
        </template>
      </v-field-layout>
      <v-field-layout>
        <template #label>
          <v-label truncate>{{ t('editor.hint.toNode') }}</v-label>
        </template>
        <template #value>
          <v-select-box v-model="editToNode" :items="toNodeOptions" />
        </template>
      </v-field-layout>
    </v-fieldset>
  </v-sidebar-section>
</template>
