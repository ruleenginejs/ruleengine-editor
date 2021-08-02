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
          <v-label truncate>Name</v-label>
        </template>
        <template #value>
          <v-input v-model="editName" />
        </template>
      </v-field-layout>
      <v-field-layout>
        <template #label>
          <v-label truncate>Type</v-label>
        </template>
        <template #value>
          <v-label truncate>{{ model.type }}</v-label>
        </template>
      </v-field-layout>
      <v-field-layout>
        <template #label>
          <v-label truncate>Identifier</v-label>
        </template>
        <template #value>
          <v-label truncate>{{ model.id }}</v-label>
        </template>
      </v-field-layout>
    </v-fieldset>
    <v-fieldset
      v-if="canShowHandler"
      :label="t('editor.sidebar.handler')"
      b-border
    >
      <v-field-layout vertical>
        <template #value>
          <v-autocomplete
            :placeholder="t('editor.hint.handler')"
            :loading-message="t('editor.suggest.loading')"
            :empty-result-message="t('editor.suggest.emptyResult')"
            v-model="editHandlerFile"
            icon-clickable
          >
            <template #icon>
              <span
                v-if="!editHandlerFile"
                class="codicon codicon-new-file"
              ></span>
              <span v-else class="codicon codicon-go-to-file"></span>
            </template>
          </v-autocomplete>
        </template>
      </v-field-layout>
    </v-fieldset>
    <v-fieldset
      v-if="canShowPorts"
      :label="t('editor.sidebar.ports')"
      b-border
    ></v-fieldset>
    <v-fieldset
      v-if="canShowConnections"
      :label="t('editor.sidebar.connections')"
    ></v-fieldset>
  </v-sidebar-section>
  <v-sidebar-section
    v-if="canShowUserProps"
    :title="t('editor.sidebar.userProperties')"
    header-compact
    expand
    :header-border="true"
    :bottom-border="false"
  >
  </v-sidebar-section>
</template>

<script>
import {
  VSidebarSection,
  VFieldset,
  VFieldLayout,
  VLabel,
  VInput,
  VAutocomplete
} from "@ruleenginejs/ruleengine-ui";
import { toRefs } from "vue";
import useNodeProps from "./composables/use-node-props";

export default {
  name: "v-editor-node-props",
  components: {
    VSidebarSection,
    VFieldset,
    VFieldLayout,
    VLabel,
    VInput,
    VAutocomplete
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    editDelay: {
      type: Number,
      default: null
    }
  },
  emits: ["edit"],
  setup(props, { emit }) {
    const { model, editDelay } = toRefs(props);

    const {
      sectionName,
      editName,
      editHandlerFile,
      canShowName,
      canShowHandler,
      canShowPorts,
      canShowConnections,
      canShowUserProps,
      localize
    } = useNodeProps({ nodeModel: model, emit, editDelay });

    return {
      sectionName,
      editName,
      editHandlerFile,
      canShowName,
      canShowHandler,
      canShowPorts,
      canShowConnections,
      canShowUserProps,
      t: localize
    };
  }
};
</script>
