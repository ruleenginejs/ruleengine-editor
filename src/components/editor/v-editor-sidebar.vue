<template>
  <v-sidebar :lt-border="sidebarBorder" w-full h-full>
    <v-editor-sidebar-no-action v-if="noAction" :message="noActionMessage" />
    <v-content v-else scroll="sm" h-full w-full>
      <component
        v-if="propsComponentName"
        :is="propsComponentName"
        :model="model.selectedObject"
      />
    </v-content>
  </v-sidebar>
</template>

<script>
import { toRefs } from "vue";
import { VSidebar, VContent } from "@ruleenginejs/ruleengine-ui-kit-vue";
import VEditorSidebarNoAction from "./v-editor-sidebar-no-action";
import VEditorStepProps from "./v-editor-step-props";
import VEditorConnectionProps from "./v-editor-connection-props";
import VEditorPortProps from "./v-editor-port-props";
import useSidebar from "./composables/use-sidebar";

export default {
  name: "v-editor-sidebar",
  components: {
    VSidebar,
    VContent,
    VEditorSidebarNoAction,
    VEditorStepProps,
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
    }
  },
  setup(props) {
    const { model } = toRefs(props);

    const propsComponents = {
      node: VEditorStepProps.name,
      port: VEditorPortProps.name,
      connection: VEditorConnectionProps.name
    };

    const { noAction, noActionMessage, propsComponentName } = useSidebar({
      model,
      propsComponents
    });

    return {
      noAction,
      noActionMessage,
      propsComponentName
    };
  }
};
</script>
