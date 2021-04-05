import { ref } from "vue";

export class SelectableModel {
  constructor() {
    this.selected = ref(false);
  }
}
