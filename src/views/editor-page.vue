<template>
  <v-editor :value="value" />
</template>

<script>
const pipeline = {
  title: "This title",
  description: "This description",
  steps: [
    {
      id: 1,
      type: "start",
      connect: [{ stepId: 2 }]
    },
    {
      id: 2,
      type: "single"
    }
  ]
};

export default {
  name: "editor-page",
  data() {
    return {
      value: JSON.stringify(pipeline)
    };
  }
};
</script>
