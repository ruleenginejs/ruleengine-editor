import { EditCommandsRegistry } from "@/utils/edit-command";
import { ChangeNodePosition } from "./commands/change-node-position";
import { CreateNewConnection } from "./commands/create-new-connection";
import { DeleteConnection } from "./commands/delete-connection";

EditCommandsRegistry.current.registerCommand(ChangeNodePosition.NAME, ChangeNodePosition);
EditCommandsRegistry.current.registerCommand(CreateNewConnection.NAME, CreateNewConnection);
EditCommandsRegistry.current.registerCommand(DeleteConnection.NAME, DeleteConnection);

export {
  ChangeNodePosition
}
