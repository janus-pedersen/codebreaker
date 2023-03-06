import { Command } from "../Command";
import { CommandManager } from "../CommandManager";
import { StringInput } from "../inputs/StringInput";

export const cd = new Command("cd")
  .setDescription("Change directory")
	.addInput(new StringInput("path", "The path to change to", true))
	.setCategory("Files")
  .onExec((system, path) => {
    if (path === undefined) throw new Error("Invalid path");
    system.changeDirectory(path);
  });

CommandManager.addDefaultCommand(cd);
