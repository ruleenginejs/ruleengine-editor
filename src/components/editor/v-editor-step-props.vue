<template>
  <v-sidebar-section
    :title="sectionName"
    header-compact
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
          <v-input :model-value="model.name" />
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
      <v-field-layout>
        <template #label>
          <v-label truncate>Type</v-label>
        </template>
        <template #value>
          <v-label truncate>{{ model.type }}</v-label>
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
            :model-value="model.handlerFile"
            icon-clickable
          >
            <template #icon>
              <span
                v-if="!model.handlerFile"
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
} from "@ruleenginejs/ruleengine-ui-kit-vue";
import useStepProps from "./composables/use-step-props";
import { GraphNodeModel } from "./composables/graph-node-model";
import { toRefs } from "@vue/reactivity";

export default {
  name: "v-editor-step-props",
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
      type: GraphNodeModel,
      required: true
    }
  },
  setup(props) {
    const { model } = toRefs(props);
    const {
      sectionName,
      canShowName,
      canShowHandler,
      canShowPorts,
      canShowConnections,
      canShowUserProps,
      localize
    } = useStepProps({ nodeModel: model });

    return {
      sectionName,
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
