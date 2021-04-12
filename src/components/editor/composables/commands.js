import { EditCommandsRegistry } from "@/utils/edit-command";
import { ChangeNodePosition } from "./commands/change-node-position";
import { CreateNewConnection } from "./commands/create-new-connection";
import { CreateNode } from "./commands/create-node";
import { DeleteConnection } from "./commands/delete-connection";
import { DeleteNode } from "./commands/delete-node";

EditCommandsRegistry.current.registerCommand(ChangeNodePosition.NAME, ChangeNodePosition);
EditCommandsRegistry.current.registerCommand(CreateNewConnection.NAME, CreateNewConnection);
EditCommandsRegistry.current.registerCommand(DeleteConnection.NAME, DeleteConnection);
EditCommandsRegistry.current.registerCommand(CreateNode.NAME, CreateNode);
EditCommandsRegistry.current.registerCommand(DeleteNode.NAME, DeleteNode);

export {
  ChangeNodePosition
}
