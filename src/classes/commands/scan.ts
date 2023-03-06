import { CommandManager } from "./../CommandManager";
import { Command } from "./../Command";
export const scan = new Command("scan")
  .setDescription("Scans the network for systems with an open 'scan' port")
  .setCategory("Network")
  .setRoot()
  .onExec((system) => {
    const network = system.network;
    if (!network) {
      throw Error("System is not connected to a network");
    }

    const systems = network.scan(system);
    if (systems.length === 0) {
      throw Error("No systems found, are the correct ports open?");
    }

		system.terminal.basic("Systems found:", false);
		const longestName = systems.reduce((a, b) => a.name.length > b.name.length ? a : b).name.length;
    for (const s of systems) {
      const l = `- ${(s.name + " ").padEnd(longestName + 10, '-')} (${s.ip})`;
      if (s.ip === system.ip) {
        system.terminal.info(l, false);
      } else {
        system.terminal.basic(l, false);
      }
    }
  });

CommandManager.addDefaultCommand(scan);
