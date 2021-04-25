<template>
  <v-sidebar :lt-border="sidebarBorder" w-full h-full>
    <v-content scroll="sm" h-full w-full>
      <v-sidebar-section
        title="Connection"
        header-compact
        expand
        :header-border="true"
        :bottom-border="false"
      >
        <v-fieldset b-border>
          <v-field-layout>
            <v-label>Some property</v-label>
            <v-input>
              <template #icon>
                <v-icon-file-menu />
              </template>
            </v-input>
          </v-field-layout>
          <v-field-layout>
            <v-label>Some property</v-label>
            <v-input />
          </v-field-layout>
        </v-fieldset>
        <v-fieldset label="Some input group">
          <v-field-layout vertical>
            <v-label>Some property</v-label>
            <v-input />
          </v-field-layout>
          <v-field-layout vertical>
            <v-label>Some property</v-label>
            <v-input>
              <template #icon>
                <v-icon-file-menu />
              </template>
            </v-input>
          </v-field-layout>
        </v-fieldset>
      </v-sidebar-section>
      <v-sidebar-section
        title="User props"
        header-compact
        expand
        :header-border="true"
        :bottom-border="false"
      >
      </v-sidebar-section>
    </v-content>
  </v-sidebar>
</template>

<script>
import {
  VSidebar,
  VContent,
  VSidebarSection,
  VFieldset,
  VFieldLayout,
  VLabel,
  VInput,
  VIconFileMenu
} from "@ruleenginejs/ruleengine-ui-kit-vue";

export default {
  name: "v-editor-sidebar",
  components: {
    VSidebar,
    VContent,
    VSidebarSection,
    VFieldset,
    VFieldLayout,
    VLabel,
    VInput,
    VIconFileMenu
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
