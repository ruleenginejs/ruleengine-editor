<template>
  <v-layout h-full w-full class="v-editor__no-content">
    <div class="v-editor-error">
      <p>{{ message }}</p>
    </div>
  </v-layout>
</template>

<script>
import { computed, toRefs } from "vue";
import localize from "@/utils/localize";
import { VLayout } from "@ruleenginejs/ruleengine-ui-kit-vue";

export default {
  name: "v-editor-error",
  components: {
    VLayout
  },
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const { error } = toRefs(props);

    const detailsMessage = computed(() => {
      return error.value?.message ?? null;
    });

    const message = computed(() => {
      let msg = localize("editor.errorMessage");
      if (detailsMessage.value) {
        msg += " ";
        msg += localize("editor.errorDetails", detailsMessage.value);
      }
      return msg;
    });

    return {
      message
    };
  }
};
</script>

<style>
@import "editor-error";
</style>
