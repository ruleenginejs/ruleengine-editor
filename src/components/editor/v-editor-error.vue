<template>
  <div class="v-editor-error">
    <p>
      {{ message }}
    </p>
  </div>
</template>

<script>
import { computed, toRefs } from "vue";
import localize from "@/utils/localize";

export default {
  name: "v-editor-error",
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
