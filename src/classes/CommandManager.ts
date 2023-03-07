import { System } from "./System";
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

  async handleCommand(i: string, system: System) {
    const terminal = system.terminal;
    if (!i) {
      terminal.basic("");
      return;
    }

    if (terminal.shouldIgnore()) {
      return;
		}
		
		terminal.commandHistory.push(i);

    terminal.info(i, true);

    const cmdName = i.split(" ")[0];
    const args = i.match(/(?:[^\s"]+|"[^"]*"|'[^']*')+/g);
    if (args) {
      args.shift();
      args.forEach((a, i) => {
        if (a.startsWith('"') && a.endsWith('"')) {
          args[i] = a.slice(1, -1);
        }
      });
    }

    const command = this.getCommand(cmdName);
    if (!command) {
      terminal.error(`Command not found: ${cmdName}`, false);
      return;
    }

    if (command.requiresRoot && !system.user.hasRoot) {
      terminal.error("You need to be root to run this command", false);
      return;
    }

    try {
      const parsedArgs = command?.parseArgs(args!);
      await (command?.exec as any)(terminal.system, ...(parsedArgs || []));

      if (command.suspicion) {
        system.network?.game?.setSuspicion((s) => s + command.suspicion);
      }

    } catch (e) {
      terminal.error((e as any).message, false);
    }
  }
}
