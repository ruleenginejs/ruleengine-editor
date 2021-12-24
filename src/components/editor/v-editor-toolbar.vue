<script>
export default {
  name: "v-editor-toolbar"
}
</script>

<script setup>
import {
  VFloatingToolbar,
  VActionList,
  VActionItem,
  VDraggable,
} from "@ruleenginejs/ui";
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
  invalidate: {
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
const emit = defineEmits([
  "action-click",
  "update:invalidate"
]);

const {
  actions: initActions,
  preserveDefaultActions,
  vertical: initVertical,
  invalidate: initInvalidate,
  showActionLabel: initShowActionLabel
} = toRefs(props);

const {
  actions,
  vertical,
  showActionLabel,
  invalidate,
  findAction,
  enableAction,
  isString,
  onActionClick
} = useToolbar({
  initActions,
  initVertical,
  initInvalidate,
  initShowActionLabel,
  preserveDefaultActions,
  emit
});

defineExpose({
  findAction,
  enableAction
});
</script>

<template>
  <v-floating-toolbar
    class="v-editor-toolbar"
    :container="container"
    :fixed="fixed"
    :vertical="vertical"
    :x="positionX"
    :y="positionY"
    v-model:invalidate="invalidate"
  >
    <v-action-list :vertical="vertical">
      <template v-for="action in actions" :key="action.id">
        <v-draggable
          v-if="action.visible && action.draggable"
          hint
          fixed
          :disabled="action.disabled"
          @drag-end="onActionClick(action, $event)"
        >
          <v-action-item
            class="v-editor-toolbar__action-item"
            :icon="isString(action.icon) ? action.icon : null"
            :title="action.title"
            :disabled="action.disabled"
          >
            <template v-if="showActionLabel" #default>{{ action.label }}</template>
            <template v-if="action.icon && !isString(action.icon)" #icon>
              <component :is="action.icon" />
            </template>
          </v-action-item>
        </v-draggable>
        <v-action-item
          v-else-if="action.visible"
          class="v-editor-toolbar__action-item"
          :icon="isString(action.icon) ? action.icon : null"
          :title="action.title"
          :disabled="action.disabled"
          @click="onActionClick(action, $event)"
        >
          <template v-if="showActionLabel" #default>{{ action.label }}</template>
          <template v-if="action.icon && !isString(action.icon)" #icon>
            <component :is="action.icon" />
          </template>
        </v-action-item>
      </template>
    </v-action-list>
  </v-floating-toolbar>
</template>

<style>
@import "editor-toolbar";
</style>
