import { Command } from "./Command";

export class CommandManager {
	static defaultCommands: Command[] = [];
  commands = CommandManager.defaultCommands;
	
  static addDefaultCommand(command: Command<any>) {
		CommandManager.defaultCommands.push(command);
  }

  addCommand(command: Command) {
    this.commands.push(command);
  }

  getCommand(name: string) {
		return this.commands.find((command) => command.name === name);
  }
}
