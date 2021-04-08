<template>
  <v-editor
    :value="value"
    v-model:zoom="zoom"
    v-model:viewport="viewport"
    auto-fit
    @change-value="onChangeValue"
  />
  <div class="controls">
    <button @click="changeValue">Change value</button>
    <div>Zoom: {{ zoom }}, Viewport: {{ viewport }}</div>
  </div>
</template>

<script>
const pipeline = {
  title: "This title",
  description: "This description",
  steps: [
    {
      id: 1,
      type: "start",
      connect: [
        {
          stepId: 2,
          dstInPort: "test"
        }
      ],
      canvas: {
        position: [50, 50]
      }
    },
    {
      id: 2,
      type: "single",
      name: "Response",
      props: { a: 1, b: 2 },
      handler: "var a = 1;",
      ports: {
        in: ["test"],
        out: ["test2"]
      },
      connect: [{ stepId: 3 }],
      canvas: {
        position: [150, 50],
        color: "#1795D4"
      }
    },
    {
      id: 3,
      type: "end",
      canvas: {
        position: [600, 150]
      }
    }
  ]
};

export default {
  name: "editor-page",
  data() {
    return {
      value: JSON.stringify(pipeline),
      zoom: 100,
      viewport: [100, 100]
    };
  },
  methods: {
    changeValue() {
      this.value = JSON.stringify({ ...pipeline, title: Date.now() });
    },
    onChangeValue(e) {
      console.log(e);
    }
  }
};
</script>

<style scoped>
.controls {
  position: absolute;
  left: 0;
  bottom: 0;
  color: var(--foreground);
}
</style>
