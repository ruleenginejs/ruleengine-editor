import { GraphBaseModel } from "./graph-base-model";

export class SelectableModel extends GraphBaseModel {
  constructor() {
    super();
    this.selected = false;
  }
}
