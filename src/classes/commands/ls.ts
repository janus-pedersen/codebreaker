import { ValuableFile } from "./../ValuableFile";
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
      if (file instanceof ValuableFile) {
        const l = `  ${file.name} (${file.value.toFixed(2).toString()}$)`;
        if (file.sold || file.value === 0) {
          system.terminal.error(l, false);
        } else {
          system.terminal.success(l, false);
        }
        continue;
      }

      system.terminal.basic(
        "  " + file.name + (file instanceof SystemDirectory ? "/" : ""),
        false
      );
    }
  });

CommandManager.addDefaultCommand(ls);
