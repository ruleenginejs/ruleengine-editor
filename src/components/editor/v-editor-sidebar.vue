<template>
  <v-sidebar :lt-border="sidebarBorder" w-full h-full>
    <v-editor-sidebar-no-action v-if="noAction" :message="noActionMessage" />
    <v-content v-else scroll="sm" h-full w-full>
      <component
        v-if="propsComponentName"
        :key="model.selectedObject.id"
        :is="propsComponentName"
        :model="model.selectedObject"
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
    model: {
      type: Object,
      required: true
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
  setup(props) {
    const { model } = toRefs(props);

    const propsComponents = {
      node: VEditorNodeProps.name,
      port: VEditorPortProps.name,
      connection: VEditorConnectionProps.name
    };

    const {
      noAction,
      noActionMessage,
      propsComponentName,
      onEdit
    } = useSidebar({
      model,
      propsComponents
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
