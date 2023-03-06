import { CommandManager } from "./../CommandManager";
import { Command } from "../Command";
import { StringInput } from "../inputs/StringInput";

export const user = new Command("user")
  .setDescription("Changes the current user, or lists all users")
  .setCategory("Security")
  .addInput(new StringInput("user", "The user to change to (leave blank to list available users)", false))
  .onExec(async (system, user) => {
    if (!user) {
      const minLen = system.users.reduce((a, b) =>
        a.name.length > b.name.length ? a : b
      ).name.length;
      system.terminal.basic("name:".padEnd(minLen + 10) + "root:", false);
      for (const user of system.users.sort((a, b) => a.hasRoot ? -1 : 1)) {
        const l = `  ${user.name.padEnd(minLen + 10)} ${
          user.hasRoot ? "y" : "n"
        }`;
        if (user.name === system.user.name) {
          system.terminal.info(l, false);
        } else  {
          system.terminal.basic(l, false);
				} 
      }
      return;
    }

    const userObj = system.users.find((u) => u.name === user);
    if (!userObj) throw Error("No user found with that name");

		await system.setUser(userObj);
		system.terminal.updatePrompt();
		system.terminal.clear()
  });

CommandManager.addDefaultCommand(user);
