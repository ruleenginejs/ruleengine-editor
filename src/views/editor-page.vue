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
      <li><button @click="onDeleteSelected">Delete Selected</button></li>
      <li><button @click="changeValue">Change Value</button></li>
      <li><button @click="undo">Undo</button></li>
      <li><button @click="redo">Redo</button></li>
      <li><button @click="createNodes">Create Nodes</button></li>
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
      edits: [],
      index: 0
    };
  },
  methods: {
    getInstance() {
      return this.$refs.editor.instance;
    },
    changeValue() {
      this.value = JSON.stringify({ ...data, title: Date.now() });
    },
    onChangeValue(e) {
      console.log(e);
      this.edits.push(e.changes);
      console.log(this.edits);
      this.index = this.edits.length - 1;
    },
    revertAllChanges() {
      const changes = [];
      this.edits.forEach((edit) =>
        changes.push(...edit.map((e) => e.reverse).reverse())
      );
      this.edits = [];
      console.log(changes);
      this.getInstance().applyEdits(changes.reverse(), false);
    },
    createNodes() {
      const instance = this.getInstance();
      instance.newNode("start");
      instance.newNode("end");
      instance.newNode("error");
      instance.newNode("single");
      instance.newNodeInCurrentViewWithOffset("single", [40, 40], {
        name: "New Single"
      });
      instance.newNodeInCurrentViewWithOffset(
        "composite",
        [20, 20],
        {
          name: "New Composite"
        },
        false
      );
    },
    onDeleteSelected() {
      this.getInstance().deleteSelectedObject();
    },
    undo() {
      if (this.edits[this.index]) {
        const changes = this.edits[this.index].map((e) => e.reverse).reverse();
        console.log("Undo changes: ", changes);
        this.getInstance().applyEdits(changes, false);
      }
      this.index--;
      if (this.index < 0) {
        this.index = -1;
      }
    },
    redo() {
      this.index++;
      if (this.index > this.edits.length - 1) {
        this.index = this.edits.length - 1;
      }
      if (this.index >= 0 && this.edits[this.index]) {
        const changes = this.edits[this.index].map((e) => e.applied);
        console.log("Redo changes: ", changes);
        this.getInstance().applyEdits(changes, false);
      }
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
