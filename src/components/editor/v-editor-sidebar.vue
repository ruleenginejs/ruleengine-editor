<template>
  <v-sidebar :lt-border="sidebarBorder" w-full h-full>
    <v-editor-sidebar-no-action v-if="noAction" :message="noActionMessage" />
    <v-content v-else scroll="sm" h-full w-full>
      <component
        v-if="propsComponentName"
        :key="selectedObject.id"
        :is="propsComponentName"
        :model="selectedObject"
        :edit-delay="editDelay"
        @edit="onEdit"
      />
    </v-content>
  </v-sidebar>
</template>

<script>
import { toRefs } from "vue";
import { VSidebar, VContent } from "@ruleenginejs/ruleengine-ui-kit-vue";
import VEditorSidebarNoAction from "./v-editor-sidebar-no-action";
import VEditorNodeProps from "./v-editor-node-props";
import VEditorConnectionProps from "./v-editor-connection-props";
import VEditorPortProps from "./v-editor-port-props";
import { GraphModelType } from "./composables/graph-model-util";
import useSidebar from "./composables/use-sidebar";

export default {
  name: "v-editor-sidebar",
  components: {
    VSidebar,
    VContent,
    VEditorSidebarNoAction,
    VEditorNodeProps,
    VEditorConnectionProps,
    VEditorPortProps
  },
  props: {
    selectedObject: {
      type: Object,
      default: null
    },
    sidebarBorder: {
      type: Boolean,
      default: false
    },
    editDelay: {
      type: Number,
      default: null
    }
  },
  emits: ["edit"],
  setup(props, { emit }) {
    const { selectedObject } = toRefs(props);

    const propsComponents = {
      [GraphModelType.Node]: VEditorNodeProps.name,
      [GraphModelType.Port]: VEditorPortProps.name,
      [GraphModelType.Connection]: VEditorConnectionProps.name
    };

    const {
      noAction,
      noActionMessage,
      propsComponentName,
      onEdit
    } = useSidebar({
      selectedObject,
      propsComponents,
      emit
    });

    return {
      noAction,
      noActionMessage,
      propsComponentName,
      onEdit
    };
  }
};
</script>
