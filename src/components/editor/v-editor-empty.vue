<template>
  <div class="v-editor-empty">
    <div v-if="$slots['default']" class="v-editor-empty__content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "v-editor-empty"
};
</script>

<style>
@import "editor-empty";
</style>
