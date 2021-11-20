<template>
  <v-layout h-full w-full h-center w-center class="v-editor__no-content">
    <div v-if="$slots['default']" class="v-editor-empty">
      <slot></slot>
    </div>
  </v-layout>
</template>

<script>
import { VLayout } from "@ruleenginejs/ruleengine-ui";

export default {
  name: "v-editor-empty",
  components: {
    VLayout
  }
};
</script>

<style>
@import "editor-empty";
</style>
