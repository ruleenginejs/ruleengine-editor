<template>
  <!--
  <v-editor
    ref="editor"
    :value="value"
    v-model:zoom="zoom"
    v-model:viewport="viewport"
    auto-fit
    @change-value="onChangeValue"
  />
  -->
  <editor-with-sidebar :value="value" @change-value="onChangeValue" />
  <div class="controls">
    <button @click="changeValue">Change value</button>
    <button @click="revertAllChanges">Revert changes</button>
    <button @click="createNodes">Create nodes</button>
    <div>Zoom: {{ zoom }}, Viewport: {{ viewport }}</div>
  </div>
</template>

<script>
import data from "./editor-data";
import EditorWithSidebar from "./editor-with-sidebar";

export default {
  name: "editor-page",
  components: {
    EditorWithSidebar
  },
  data() {
    return {
      value: JSON.stringify(data),
      zoom: 100,
      viewport: [100, 100],
      edits: []
    };
  },
  methods: {
    changeValue() {
      this.value = JSON.stringify({ ...data, title: Date.now() });
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
      this.$refs.editor.instance.applyEdits(changes.reverse(), false);
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
