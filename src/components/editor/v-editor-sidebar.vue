<template>
  <v-sidebar style="color:var(--editor-foreground)" :lt-border="sidebarBorder" w-full h-full>
    {{ model.selectedObject }}
  </v-sidebar>
</template>

<script>
import { VSidebar } from "@ruleenginejs/ruleengine-ui-kit-vue";

export default {
  name: "v-editor-sidebar",
  components: {
    VSidebar
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
  }
};
</script>
