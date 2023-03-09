import { CommandManager } from "./../CommandManager";
import { Command } from "./../Command";
export const scan = new Command("scan")
  .setDescription("Scans the network for systems with an open 'scan' port")
  .setCategory("Network")
  .setRoot()
  .onExec(async (system) => {
    const network = system.network;
    if (!network) {
      throw Error("System is not connected to a network");
    }

    const systems = network.scan(system);
    if (systems.length === 0) {
      throw Error("No systems found, are the correct ports open?");
    }
    const time = systems.length * 250;
    await system.terminal.wait(time)

    const rows = [];
    for (const s of systems) {
      console.log(s.name);
      if(s.name === system.name) continue;
      rows.push([s.name, s.ip]);
    }
    system.terminal.printTable(["Hostname", "IP"], rows);

  });

CommandManager.addDefaultCommand(scan);
