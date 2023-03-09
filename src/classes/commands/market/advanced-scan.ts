import { PORTS } from "./../../../utils/ports";
import { Command } from "../../Command";

export const advancedScan = new Command("advanced-scan")
  .setDescription(
    "Scan a system for vulnerabilities. It also scans via the ping port, so more systems might be found"
  )
  .setCategory("Black Market")
  .setSuspicion(10)
  .onExec(async (system) => {
    // Things to display, current user, current user root level, ip, fileCount, bankBalance

    const network = system.network;
    if (!network) {
      throw Error("System is not connected to a network");
    }

    let items: string[][] = [];

		for (const s of system.network!.getSystems()) {
			if(s.name === system.name) continue;
      const scanOpen =
        s.firewall.canAccess(system.ip, PORTS.SCAN, "inbound") &&
        system.firewall.canAccess(s.ip, PORTS.SCAN, "outbound");
      const pingOpen =
        s.firewall.canAccess(system.ip, PORTS.PING, "inbound") &&
        system.firewall.canAccess(s.ip, PORTS.PING, "outbound");

      if (!scanOpen && !pingOpen) continue;

      const hostname = s.name;
      const currentUser = s.user;
      const currentUserRootLevel = currentUser.hasRoot;
      const ip = s.ip;
      const fileCount = s.files.countFiles();
      const bankBalance = system.network?.game?.bank.getAccount(s)?.balance;

      items.push([
        hostname,
        currentUser.name,
        currentUserRootLevel ? "y" : "n",
        ip,
        fileCount.toString(),
        bankBalance === -1 ? "n/d" : bankBalance!.toFixed(2).toString(),
      ]);
		}
		
		const time = items.length * 550;
		await system.terminal.wait(time)

    system.terminal.printTable(
      ["Hostname", "User", "Root", "IP", "Files", "Balance"],
      items
    );
  });
