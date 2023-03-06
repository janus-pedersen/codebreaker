import { CommandManager } from './../CommandManager';
import { StringInput } from "./../inputs/StringInput";
import { Command } from "../Command";

export const cat = new Command("cat")
  .setDescription("Prints the contents of a file")
  .setCategory("Filesystem")
  .addInput(new StringInput("file", "The file to print", true))
	.onExec((system, file) => {
		if(!file) throw new Error("No file specified");
    const fileObj = system.getFile(file);
    if (!fileObj) return system.terminal.error("No file found with that name");
    system.terminal.basic(fileObj.read(), false);
  });

	CommandManager.addDefaultCommand(cat);