import { CommandManager } from './../CommandManager';
import { Command } from "../Command";
import { StringInput } from "../inputs/StringInput";
import { SystemDirectory } from "../SystemDirectory";

export const mkdir = new Command("mkdir")
  .setDescription("Creates a new directory")
	.addInput(new StringInput("name", "The name of the directory", true))
	.setCategory("Filesystem")
  .onExec((system, name) => {
    if (name === undefined) throw new Error("Invalid name");
    if (name.match(/[^a-zA-Z0-9_\- ]/)) throw new Error("Invalid name");
    if (name.length > 32) throw new Error("Name too long");
    if (name.length < 1) throw new Error("Name too short");
    if (system.getDirectory(system.currentDirectory)?.hasFile(name))
      throw new Error("Directory already exists");

    system
      .getDirectory(system.currentDirectory)
      ?.addFile(new SystemDirectory(name));
  });

CommandManager.addDefaultCommand(mkdir);