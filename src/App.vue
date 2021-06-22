<template>
  <ul class="nav">
    <li @click="pageName = 'page1'">Editor</li>
    <li @click="pageName = 'page2'">Editor With Sidebar</li>
  </ul>
  <editor-page v-if="pageName === 'page1'" />
  <editor-with-sidebar-page v-else-if="pageName === 'page2'" />
</template>

<script>
import EditorPage from "./views/editor-page";
import EditorWithSidebarPage from "./views/editor-with-sidebar-page";

export default {
  name: "App",
  components: {
    EditorPage,
    EditorWithSidebarPage
  },
  data() {
    return {
      pageName: null
    };
  }
};
</script>

<style>
@import "tailwindcss/base";

html,
body,
#app {
  @apply w-full h-full;
}

.nav {
  @apply absolute left-1 top-1;
}
.nav li {
  @apply cursor-pointer;
}
</style>
