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
    <ul>
      <li><button @click="changeValue">Change value</button></li>
      <li><button @click="revertAllChanges">Revert changes</button></li>
      <li><button @click="createNodes">Create nodes</button></li>
      <li>
        <div>Zoom: {{ zoom }}, Viewport: {{ viewport }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import data from "./editor-data";

export default {
  name: "editor-page",
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
      const instance = this.$refs.editor.instance;
      instance.newNode("start");
      instance.newNode("end");
      instance.newNode("error");
      instance.newNode("single");
      instance.newNodeInCurrentViewWithOffset("single", [40, 40], {
        name: "New Single"
      });
      instance.newNodeInCurrentViewWithOffset("composite", [20, 20], {
        name: "New Composite"
      });
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
