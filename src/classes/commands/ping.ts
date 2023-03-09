import { PORTS } from "./../../utils/ports";
import { Ip } from "../../types";
import { Command } from "../Command";
import { StringInput } from "../inputs/StringInput";
import { randomNumber } from "../../utils/random";
import { CommandManager } from "../CommandManager";

export const ping = new Command("ping")
  .setDescription("Ping a system")
  .setCategory("Network")
  .addInput(new StringInput("ip", "IP Address to ping", true))
  .setSuspicion(1)
  .onExec(async (system, ip) => {
    const target = system.network?.fromIp(ip as Ip);

    const ping = randomNumber(1, 100);
    await system.terminal.wait(ping * 10);
    if (!target) throw Error("No system found with that IP");
    system.terminal.basic(`Pinging ${target.name} (${target.ip})...`, false);
    if (
      !(
        system.firewall.canAccess(target?.ip, PORTS.PING, "outbound") &&
        target.firewall.canAccess(system.ip, PORTS.PING, "inbound")
      )
    ) {
      throw Error("Access denied, firewall blocked ping");
    }

    system.terminal.success(
      `Reply from ${target.ip}: bytes=32 time=${ping}ms TTL=64`,
      false
    );
  });

CommandManager.addDefaultCommand(ping);
