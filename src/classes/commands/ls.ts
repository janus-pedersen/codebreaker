import { SystemDirectory } from "./../SystemDirectory";
import { Command } from "../Command";
import { CommandManager } from "../CommandManager";

export const ls = new Command("ls")
	.setDescription("Lists all files in the current directory")
	.setCategory("Filesystem")
  .onExec((system) => {
    const files = system.getDirectory(system.currentDirectory)?.files;
    if (!files) return system.terminal.error("No files found");

    files.sort((a, b) => {
      if (a instanceof SystemDirectory && !(b instanceof SystemDirectory))
        return -1;
      if (!(a instanceof SystemDirectory) && b instanceof SystemDirectory)
        return 1;
      return a.name.localeCompare(b.name);
    });

    for (const file of files) {
      system.terminal.basic(
        "  " + file.name + (file instanceof SystemDirectory ? "/" : ""),
        false
      );
    }
  });

CommandManager.addDefaultCommand(ls);
