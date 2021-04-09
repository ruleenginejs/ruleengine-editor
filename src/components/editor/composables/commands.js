import { EditCommandsRegistry } from "@/utils/edit-command";
import { ChangeNodePosition } from "./commands/change-node-position";

EditCommandsRegistry.current.registerCommand(ChangeNodePosition.NAME, ChangeNodePosition);

export {
  ChangeNodePosition
}
