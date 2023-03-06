import { CommandManager } from "./../CommandManager";
import { Command } from "./../Command";
export const root = new Command("root")
  .setDescription("Check if you are root")
  .setCategory("Security")
  .onExec((system) => {
    if (system.user.hasRoot) {
      system.terminal.success("You are root", false);
    } else {
      system.terminal.error("You are not root", false);
    }
  });

CommandManager.addDefaultCommand(root);
