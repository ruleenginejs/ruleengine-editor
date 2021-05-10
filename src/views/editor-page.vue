<template>
  <v-editor
    ref="editor"
    :value="value"
    v-model:zoom="zoom"
    v-model:viewport="viewport"
    auto-fit
    @change-value="onChangeValue"
  />
  <div class="controls">
    <button @click="changeValue">Change value</button>
    <button @click="revertAllChanges">Revert changes</button>
    <button @click="createNodes">Create nodes</button>
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
      handlerFile: "./handler.js",
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
      id: 4,
      type: "single",
      name: "Response",
      props: { a: 1, b: 2 },
      handlerFile: "./handler2.js",
      ports: {
        in: ["test"],
        out: ["test2"]
      },
      canvas: {
        position: [300, -250]
      }
    },
    {
      id: 3,
      type: "end",
      canvas: {
        position: [600, 150]
      }
    },
    {
      type: "end",
      canvas: {
        position: [400, 150]
      }
    },
    {
      type: "error",
      canvas: {
        position: [10, 10]
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
      viewport: [100, 100],
      edits: []
    };
  },
  methods: {
    changeValue() {
      this.value = JSON.stringify({ ...pipeline, title: Date.now() });
    },
    onChangeValue(e) {
      console.log(e);
      this.edits.push(e.changes);
    },
    revertAllChanges() {
      const changes = [];
      this.edits.forEach((edit) =>
        changes.push(...edit.map((e) => e.reverse).reverse())
      );
      this.edits = [];
      this.$refs.editor.instance
        .getModel()
        .applyEdits(changes.reverse(), false);
    },
    createNodes() {
      const graph = this.$refs.editor.instance.getGraph();
      graph.createNode("start");
      graph.createNode("end");
      graph.createNode("error");
      graph.createNode("single");
      graph.createNode("composite", null, { name: "Composite" });
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
