<template>
  <editor-with-sidebar :value="value" @change-value="onChangeValue" />
  <div class="controls">
    <ul>
      <li>
        <div>Zoom: {{ zoom }}, Viewport: {{ viewport }}</div>
      </li>
    </ul>
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
    onChangeValue(e) {
      console.log(e);
      this.edits.push(e.changes);
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
