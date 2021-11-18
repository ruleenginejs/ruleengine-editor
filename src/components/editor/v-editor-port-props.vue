<script>
export default {
  name: "v-editor-port-props"
};
</script>

<script setup>
import { toRefs } from "vue";
import usePortProps from './composables/use-port-props';
import localize from "@/utils/localize";
import {
  VSidebarSection,
  VFieldset,
  VFieldLayout,
  VLabel,
  VInput
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
const { sectionName, editName } = usePortProps({
  portModel: model,
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
          <v-label truncate>{{ t('editor.hint.name') }}</v-label>
        </template>
        <template #value>
          <v-input v-model="editName" />
        </template>
      </v-field-layout>
      <v-field-layout>
        <template #label>
          <v-label truncate>{{ t('editor.hint.behavior') }}</v-label>
        </template>
        <template #value>
          <v-field-layout vertical>
            <template #value>
              <v-layout gutter="sm" h-center>
                <v-checkbox id="v-checkbox_1" />
                <v-label for="checkbox_1">Disabled</v-label>
              </v-layout>
            </template>
          </v-field-layout>
        </template>
      </v-field-layout>
    </v-fieldset>
  </v-sidebar-section>
</template>
