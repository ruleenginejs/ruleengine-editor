import { EditCommandsRegistry } from "@/utils/edit-command";
import { ChangeNodeHandlerFile } from "./change-node-handler-file";
import { ChangeNodeName } from "./change-node-name";
import { ChangeNodePosition } from "./change-node-position";
import { ChangePortName } from "./change-port-name";
import { CreateNewConnection } from "./create-new-connection";
import { CreateNode } from "./create-node";
import { DeleteConnection } from "./delete-connection";
import { DeleteNode } from "./delete-node";

EditCommandsRegistry.current.registerCommand(ChangeNodePosition.NAME, ChangeNodePosition);
EditCommandsRegistry.current.registerCommand(ChangeNodeName.NAME, ChangeNodeName);
EditCommandsRegistry.current.registerCommand(ChangeNodeHandlerFile.NAME, ChangeNodeHandlerFile);
EditCommandsRegistry.current.registerCommand(ChangePortName.NAME, ChangePortName);
EditCommandsRegistry.current.registerCommand(CreateNewConnection.NAME, CreateNewConnection);
EditCommandsRegistry.current.registerCommand(DeleteConnection.NAME, DeleteConnection);
EditCommandsRegistry.current.registerCommand(CreateNode.NAME, CreateNode);
EditCommandsRegistry.current.registerCommand(DeleteNode.NAME, DeleteNode);

export {
  EditCommandsRegistry,
  ChangeNodePosition,
  ChangeNodeName,
  ChangeNodeHandlerFile,
  ChangePortName,
  CreateNewConnection,
  DeleteConnection,
  CreateNode,
  DeleteNode
}
