import { CommandManager } from "../CommandManager";
import { Command } from "./../Command";
export const home = new Command("home")
  .setDescription("Go back to your home system")
  .setCategory("Network")
  .onExec((system) => {
    system.network?.game?.home();
  });

CommandManager.addDefaultCommand(home);
