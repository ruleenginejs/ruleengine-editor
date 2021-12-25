import { EditCommandsRegistry } from "@/utils/edit-command";
import { ChangeNodeColor } from "./change-node-color";
import { ChangeNodeHandlerFile } from "./change-node-handler-file";
import { ChangeNodeName } from "./change-node-name";
import { ChangeNodePosition } from "./change-node-position";
import { ChangePortDisabled } from "./change-port-disabled";
import { ChangePortName } from "./change-port-name";
import { CreateNewConnection } from "./create-new-connection";
import { CreateNode } from "./create-node";
import { CreatePort } from "./create-port";
import { DeleteConnection } from "./delete-connection";
import { DeleteConnectionById } from "./delete-connection-by-id";
import { DeleteConnectionsByPort } from "./delete-connections-by-port";
import { DeleteNode } from "./delete-node";
import { DeletePort } from "./delete-port";

EditCommandsRegistry.current.registerCommand(ChangeNodePosition.NAME, ChangeNodePosition);
EditCommandsRegistry.current.registerCommand(ChangeNodeName.NAME, ChangeNodeName);
EditCommandsRegistry.current.registerCommand(ChangeNodeHandlerFile.NAME, ChangeNodeHandlerFile);
EditCommandsRegistry.current.registerCommand(ChangeNodeColor.NAME, ChangeNodeColor);
EditCommandsRegistry.current.registerCommand(ChangePortName.NAME, ChangePortName);
EditCommandsRegistry.current.registerCommand(ChangePortDisabled.NAME, ChangePortDisabled);
EditCommandsRegistry.current.registerCommand(CreateNewConnection.NAME, CreateNewConnection);
EditCommandsRegistry.current.registerCommand(DeleteConnection.NAME, DeleteConnection);
EditCommandsRegistry.current.registerCommand(DeleteConnectionsByPort.NAME, DeleteConnectionsByPort);
EditCommandsRegistry.current.registerCommand(DeleteConnectionById.NAME, DeleteConnectionById);
EditCommandsRegistry.current.registerCommand(CreateNode.NAME, CreateNode);
EditCommandsRegistry.current.registerCommand(DeleteNode.NAME, DeleteNode);
EditCommandsRegistry.current.registerCommand(CreatePort.NAME, CreatePort);
EditCommandsRegistry.current.registerCommand(DeletePort.NAME, DeletePort);

export {
  EditCommandsRegistry,
  ChangeNodePosition,
  ChangeNodeName,
  ChangeNodeHandlerFile,
  ChangeNodeColor,
  ChangePortName,
  ChangePortDisabled,
  CreateNewConnection,
  DeleteConnection,
  DeleteConnectionsByPort,
  DeleteConnectionById,
  CreateNode,
  DeleteNode,
  CreatePort,
  DeletePort
}
