<template>
  <v-sidebar :lt-border="sidebarBorder" w-full h-full>
    <v-editor-sidebar-no-action v-if="noAction" :message="noActionMessage" />
    <v-content v-else :scroll="sidebarScroll" h-full w-full>
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
import { VSidebar, VContent } from "@ruleenginejs/ruleengine-ui";
import VEditorSidebarNoAction from "./v-editor-sidebar-no-action.vue";
import VEditorNodeProps from "./v-editor-node-props.vue";
import VEditorConnectionProps from "./v-editor-connection-props.vue";
import VEditorPortProps from "./v-editor-port-props.vue";
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
    sidebarScroll: {
      type: String,
      default: "sm"
    },
    sidebarBorder: {
      type: Boolean,
      default: false
    },
    editDelay: {
      type: Number,
      default: 500
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

    const { noAction, noActionMessage, propsComponentName, onEdit } =
      useSidebar({
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
