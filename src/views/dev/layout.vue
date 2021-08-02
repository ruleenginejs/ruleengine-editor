<template>
  <v-layout h-full w-full>
    <v-layout not-shrink h-full>
      <v-sidebar h-full class="demo-sidebar">
        <Nav />
      </v-sidebar>
    </v-layout>
    <v-layout all-distr h-full class="demo-container">
      <router-view />
    </v-layout>
  </v-layout>
</template>

<script>
import { VLayout, VSidebar } from "@ruleenginejs/ruleengine-ui";
import Nav from "./nav";

export default {
  name: "layout",
  components: {
    VLayout,
    VSidebar,
    Nav
  }
};
</script>
