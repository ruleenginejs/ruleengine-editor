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
  VActionList,
  VActionItem
} from "@ruleenginejs/ruleengine-ui";
import { toRefs } from "vue";
import useNodeProps from "./composables/use-node-props";
import useNodePortProps from "./composables/use-node-port-props";
import useNodeConnectionProps from "./composables/use-node-connection-props";
import localize from "@/utils/localize";
import { GraphPortType } from "./composables/graph-port-type";
import VEditorNodePorts from "./v-editor-node-ports.vue";
import VEditorNodeConnnections from "./v-editor-node-connections.vue";

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
  genElementId
} = useNodeProps({ nodeModel: model, emit, editDelay });

const {
  inPorts,
  outPorts,
  canEditPort,
  onUpdatePortName,
  onUpdatePortDisabled,
  onPortRemove,
  onPortAdd
} = useNodePortProps({ nodeModel: model, emit, editDelay });

const {
  inConnections,
  outConnections,
  onConnectionRemove,
} = useNodeConnectionProps({ nodeModel: model, emit, editDelay });

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
            <v-checkbox
              v-model="editUseCustomColor"
              :id="genElementId('checkbox', 'use-custom-color')"
            />
            <v-label
              :for="genElementId('checkbox', 'use-custom-color')"
            >{{ t("editor.hint.useCustomColor") }}</v-label>
          </v-layout>
        </template>
      </v-field-layout>
      <v-field-layout>
        <template #label>
          <v-label truncate>{{ t("editor.hint.id") }}</v-label>
        </template>
        <template #value>
          <v-label truncate>{{ model.id }}</v-label>
        </template>
      </v-field-layout>
    </v-fieldset>
    <v-fieldset v-if="canShowHandler" :label="t('editor.sidebar.behavior')" b-border>
      <v-field-layout>
        <template #label>
          <v-label truncate>{{ t('editor.hint.script') }}</v-label>
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
    <v-fieldset v-if="canShowPorts" :label="t('editor.sidebar.ports')" b-border>
      <template #label-actions v-if="canEditPort">
        <v-action-list>
          <v-action-item
            icon="add"
            :title="t('editor.title.addPort')"
            @click="onPortAdd(GraphPortType.IN)"
          >{{ t('editor.sidebar.addInPort') }}</v-action-item>
          <v-action-item
            icon="add"
            :title="t('editor.title.addPort')"
            @click="onPortAdd(GraphPortType.OUT)"
          >{{ t('editor.sidebar.addOutPort') }}</v-action-item>
        </v-action-list>
      </template>
      <v-editor-node-ports
        :ports="inPorts"
        :edit-disabled="!canEditPort"
        :label="t('editor.hint.inPorts')"
        @update-name="onUpdatePortName"
        @update-disabled="onUpdatePortDisabled"
        @remove="onPortRemove"
      />
      <v-editor-node-ports
        :ports="outPorts"
        :edit-disabled="!canEditPort"
        :label="t('editor.hint.outPorts')"
        @update-name="onUpdatePortName"
        @update-disabled="onUpdatePortDisabled"
        @remove="onPortRemove"
      />
    </v-fieldset>
    <v-fieldset v-if="canShowConnections" :label="t('editor.sidebar.connections')" b-border>
      <v-editor-node-connnections
        v-if="inConnections.length"
        :connections="inConnections"
        :label="t('editor.sidebar.incoming')"
        @remove="onConnectionRemove"
      />
      <v-editor-node-connnections
        v-if="outConnections.length"
        :connections="outConnections"
        :label="t('editor.sidebar.outgoing')"
        @remove="onConnectionRemove"
      />
    </v-fieldset>
    <v-fieldset v-if="canShowUserProps" :label="t('editor.sidebar.userProperties')" b-border></v-fieldset>
  </v-sidebar-section>
</template>
