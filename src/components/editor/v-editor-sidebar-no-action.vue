<template>
  <v-layout h-full w-full h-center w-center>
    <div class="v-editor-sidebar-no-action">
      {{ message }}
    </div>
  </v-layout>
</template>

<script>
import { VLayout } from '@ruleenginejs/ui';

export default {
  name: 'v-editor-sidebar-no-action',
  components: {
    VLayout
  },
  props: {
    message: {
      type: String,
      default: null
    }
  }
};
</script>

<style>
@import 'editor-sidebar-no-action';
</style>
