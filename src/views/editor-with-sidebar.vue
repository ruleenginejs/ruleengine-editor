<template>
  <v-split-view
    :snap-offset="splitViewSnapOffset"
    :resize-delay="resizeDelay"
    @resize="onSplitViewResize"
    @created="onSplitViewCreated"
  >
    <v-split-pane>
      <v-editor
        v-if="splitViewCreated"
        ref="editor"
        :value="value"
        auto-fit
        @change-value="onEditorChangeValue"
        @change-selection="onChangeSelection"
      />
    </v-split-pane>
    <v-split-pane :size="`${sidebarSize}px`">
      <v-editor-sidebar
        v-if="splitViewCreated"
        :selected-object="selectedObject"
        :edit-delay="editDelay"
        @edit="onSidebarEdit"
      />
    </v-split-pane>
  </v-split-view>
</template>

<script>
import { VSplitView, VSplitPane } from "@ruleenginejs/ruleengine-ui-kit-vue";

const RESIZE_DELAY = 100;
const SNAP_OFFSET = 70;
const SIDEBAR_SIZE = 280;
const EDIT_DELAY = 500;

export default {
  name: "editor-with-sidebar",
  components: {
    VSplitView,
    VSplitPane
  },
  props: {
    value: {
      type: [String, Object],
      default: null
    }
  },
  emits: ["change-value"],
  data() {
    return {
      resizeDelay: RESIZE_DELAY,
      splitViewSnapOffset: SNAP_OFFSET,
      sidebarSize: SIDEBAR_SIZE,
      editDelay: EDIT_DELAY,
      splitViewCreated: false,
      selectedObject: null
    };
  },
  methods: {
    onSplitViewResize() {
      this.$refs.editor.instance.onResize();
    },
    onSplitViewCreated() {
      this.splitViewCreated = true;
    },
    onSidebarEdit(editCommands) {
      this.$refs.editor.instance.applyEdits(editCommands);
    },
    onEditorChangeValue(e) {
      this.$emit("change-value", e);
    },
    onChangeSelection(selectedItem) {
      this.selectedObject = selectedItem;
    }
  }
};
</script>
