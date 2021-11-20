<script>
export default {
  name: "v-editor-node-props"
}
</script>

<script setup>
import {
  VSidebarSection,
  VFieldset,
  VFieldLayout,
  VLabel,
  VInput,
  VAutocomplete,
  VCheckbox,
  VSelectBox,
  VLayout,
  VActionItem
} from "@ruleenginejs/ruleengine-ui";
import { toRefs } from "vue";
import useNodeProps from "./composables/use-node-props";
import localize from "@/utils/localize";

const props = defineProps({
  model: {
    type: Object,
    required: true
  },
  editDelay: {
    type: Number,
    default: null
  }
});
const emit = defineEmits(["edit"]);

const { model, editDelay } = toRefs(props);
const {
  sectionName,
  editName,
  editHandlerFile,
  editColor,
  editUseCustomColor,
  canShowName,
  canShowHandler,
  canShowPorts,
  canShowConnections,
  canShowUserProps,
  canShowColor,
  useCustomColor,
  colorOptions,
  genId
} = useNodeProps({ nodeModel: model, emit, editDelay });

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
      <v-field-layout v-if="canShowName">
        <template #label>
          <v-label truncate>{{ t("editor.hint.name") }}</v-label>
        </template>
        <template #value>
          <v-input v-model="editName" />
        </template>
      </v-field-layout>
      <v-field-layout v-if="canShowColor">
        <template #label>
          <v-label truncate>{{ t("editor.hint.color") }}</v-label>
        </template>
        <template #value>
          <v-input v-if="useCustomColor" v-model="editColor" />
          <v-select-box v-else v-model="editColor" :items="colorOptions" />
        </template>
      </v-field-layout>
      <v-field-layout v-if="canShowColor">
        <template #label></template>
        <template #value>
          <v-layout gutter="sm" h-center>
            <v-checkbox v-model="editUseCustomColor" :id="genId('checkbox', 'use-custom-color')" />
            <v-label
              :for="genId('checkbox', 'use-custom-color')"
            >{{ t("editor.hint.useCustomColor") }}</v-label>
          </v-layout>
        </template>
      </v-field-layout>
      <v-field-layout>
        <template #label>
          <v-label truncate>Id</v-label>
        </template>
        <template #value>
          <v-label truncate>{{ model.id }}</v-label>
        </template>
      </v-field-layout>
    </v-fieldset>
    <v-fieldset v-if="canShowHandler" label="Behavior" b-border>
      <v-field-layout>
        <template #label>
          <v-label truncate>Script</v-label>
        </template>
        <template #value>
          <v-autocomplete
            placeholder="Relative file path"
            :loading-message="t('editor.suggest.loading')"
            empty-result-message="No matching results."
            v-model="editHandlerFile"
            icon-clickable
          >
            <template #icon>
              <span v-if="!editHandlerFile" class="codicon codicon-new-file"></span>
              <span v-else class="codicon codicon-go-to-file"></span>
            </template>
          </v-autocomplete>
        </template>
      </v-field-layout>
    </v-fieldset>
    <v-fieldset v-if="1 || canShowPorts" :label="t('editor.sidebar.ports')" b-border>
      <v-field-layout>
        <template #label>
          <v-label truncate>In</v-label>
        </template>
        <template #value>
          <v-layout gutter="sm" h-center>
            <v-checkbox />
            <v-input />
            <v-action-item icon="plus" />
          </v-layout>
        </template>
      </v-field-layout>
      <v-field-layout>
        <template #label></template>
        <template #value>
          <v-layout gutter="sm" h-center>
            <v-checkbox />
            <v-input />
            <v-action-item icon="plus" />
          </v-layout>
        </template>
      </v-field-layout>
      <v-field-layout>
        <template #label>
          <v-label truncate>Out</v-label>
        </template>
        <template #value>
          <v-layout gutter="sm" h-center>
            <v-checkbox />
            <v-input />
            <v-action-item icon="plus" />
          </v-layout>
        </template>
      </v-field-layout>
      <v-field-layout>
        <template #label></template>
        <template #value>
          <v-layout gutter="sm" h-center>
            <v-checkbox />
            <v-input />
            <v-action-item icon="plus" />
          </v-layout>
        </template>
      </v-field-layout>
    </v-fieldset>
    <v-fieldset v-if="1 || canShowConnections" :label="t('editor.sidebar.connections')" b-border>
      <v-field-layout>
        <template #label>
          <v-select-box />
        </template>
        <template #value>
          <v-layout gutter="sm" h-center>
            <v-select-box />
            <v-action-item icon="plus" />
          </v-layout>
        </template>
      </v-field-layout>
      <v-field-layout>
        <template #label>
          <v-select-box />
        </template>
        <template #value>
          <v-layout gutter="sm" h-center>
            <v-select-box />
            <v-action-item icon="minus" />
          </v-layout>
        </template>
      </v-field-layout>
    </v-fieldset>
    <v-fieldset v-if="1 || canShowUserProps" :label="t('editor.sidebar.userProperties')" b-border>
      <v-field-layout>
        <template #label>
          <v-label truncate>Prop1</v-label>
        </template>
        <template #value>
          <v-input />
        </template>
      </v-field-layout>
      <v-field-layout>
        <template #label>
          <v-label truncate>Prop2</v-label>
        </template>
        <template #value>
          <v-select-box />
        </template>
      </v-field-layout>
    </v-fieldset>
  </v-sidebar-section>
</template>
