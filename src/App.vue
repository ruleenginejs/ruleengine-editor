<template>
  <editor-page />
</template>

<script>
import EditorPage from "./views/editor-page";

export default {
  name: "App",
  components: {
    EditorPage
  }
};
</script>

<style>
@import "tailwindcss/base";

html, body, #app {
  @apply w-full h-full;
}
</style>
