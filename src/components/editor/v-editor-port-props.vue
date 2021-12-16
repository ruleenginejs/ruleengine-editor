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
  VInput,
  VCheckbox,
  VLayout
} from "@ruleenginejs/ui";

const props = defineProps({
  model: {
    type: Object,
    required: true
  },
  editDelay: {
    type: Number,
    default: null
  },
  provider: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(["edit"])

const { model, editDelay } = toRefs(props);
const {
  sectionName,
  editName,
  editDisabled,
  editIsError,
  canEditError,
  validation,
  checkboxId
} = usePortProps({
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
          <v-input v-model="editName" :error="validation.error" :message="validation.message" />
        </template>
      </v-field-layout>
      <v-field-layout>
        <template #label>
          <v-label truncate>{{ t('editor.hint.state') }}</v-label>
        </template>
        <template #value>
          <v-layout gutter="sm" h-center>
            <v-checkbox :id="checkboxId('disabled')" v-model="editDisabled" />
            <v-label :for="checkboxId('disabled')">{{ t('editor.hint.disabled') }}</v-label>
          </v-layout>
        </template>
      </v-field-layout>
      <v-field-layout>
        <template #label>
          <v-label truncate>{{ t('editor.hint.mode') }}</v-label>
        </template>
        <template #value>
          <v-layout gutter="sm" h-center>
            <v-checkbox :id="checkboxId('error')" :disabled="!canEditError" v-model="editIsError" />
            <v-label
              :disabled="!canEditError"
              :for="checkboxId('error')"
            >{{ t('editor.hint.error') }}</v-label>
          </v-layout>
        </template>
      </v-field-layout>
    </v-fieldset>
  </v-sidebar-section>
</template>
