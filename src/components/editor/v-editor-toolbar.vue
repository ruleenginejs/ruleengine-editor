<script>
export default {
  name: "v-editor-toolbar"
}
</script>

<script setup>
import {
  VFloatingToolbar,
  VActionList,
  VActionItem
} from "@ruleenginejs/ruleengine-ui";
import useToolbar from "./composables/use-toolbar";
import { toRefs } from "vue";

const props = defineProps({
  actions: {
    type: Array,
    default: () => []
  },
  preserveDefaultActions: {
    type: Boolean,
    default: true
  },
  vertical: {
    type: Boolean,
    default: false
  },
  positionX: {
    type: Number,
    default: 0
  },
  positionY: {
    type: Number,
    default: 0
  },
  container: {
    type: [HTMLElement, String],
    default: null
  },
  fixed: {
    type: Boolean,
    default: false
  },
  showActionLabel: {
    type: Boolean,
    default: false
  },
  showAdditionalMenu: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits(["action-click"]);

const {
  actions: initActions,
  preserveDefaultActions,
  vertical: initVertical,
  showActionLabel: initShowActionLabel
} = toRefs(props);

const {
  actions,
  vertical,
  showActionLabel,
  onActionClick
} = useToolbar({
  initActions,
  initVertical,
  initShowActionLabel,
  preserveDefaultActions,
  emit
});
</script>

<template>
  <v-floating-toolbar
    :container="container"
    :fixed="fixed"
    :vertical="vertical"
    :x="positionX"
    :y="positionY"
  >
    <v-action-list :vertical="vertical">
      <template v-for="action in actions" :key="action.id">
        <v-action-item
          v-if="action.visible"
          :icon="action.icon"
          :title="action.title"
          :disabled="action.disabled"
          @click="onActionClick(action, $event)"
        >
          <template v-if="showActionLabel" #default>{{ action.label }}</template>
        </v-action-item>
      </template>
    </v-action-list>
  </v-floating-toolbar>
</template>