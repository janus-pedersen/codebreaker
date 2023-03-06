import { PORTS } from "./../../utils/ports";
import { CommandManager } from "./../CommandManager";
import { Command } from "../Command";
import { NumberInput } from "../inputs/NumberInput";
import { StringInput } from "../inputs/StringInput";
import { FirewallRule } from "../Firewall";
import { Ip } from "../../types";

export const firewall = new Command("firewall")
  .setCategory("Security")
  .setRoot()
  .setDescription("See and manage the firewall of the current system")
  .addInput(
    new StringInput("action", "The action to perform (allow/deny)", false)
  )
  .addInput(
    new NumberInput("port", "The port to perform the action on (eg. 22)", false)
  )
  .addInput(
    new StringInput("type", "Weather to allow or deny (in\\out)", false)
  )
  .addInput(new StringInput("ip", "The ip to allow or deny (optional)", false))
  .onExec((system, action, port, type, ip) => {
    if (!action && !port && !type) {
      if (system.firewall.rules.length === 0) {
        system.terminal.success("No rules found, all traffic allowed", false);
        return;
      }

      const rules = system.firewall.rules.sort((a, b) =>
        a.action === "deny" ? 1 : -1
      );


      system.terminal.basic("Port\t\t Action\t Type\t\t IP", false);

      for (const rule of rules) {
        const portUsage = Object.entries(PORTS).find(
          ([k, v]) => v === rule.port
        );
        const l = `${rule.port}${portUsage ? ` (${portUsage[0]}):` : ":\t"}\t ${
          rule.action
        }\t ${rule.type}\t ${rule.ip ? rule.ip : "*"}`;

        if (rule.action === "deny") {
          system.terminal.error(l, false);
        } else {
          system.terminal.success(l, false);
        }
      }
      return;
    }

    if (!action || !port || !type) {
      throw new Error(
        "Not enough arguments, see `help firewall` for more info"
      );
    }

    if (action !== "allow" && action !== "deny") {
      throw new Error("Invalid action, see `help firewall` for more info");
    }

    if (type !== "in" && type !== "out") {
      throw new Error("Invalid type, see `help firewall` for more info");
    }

    if (port < 0 || port > 65535) {
      throw new Error("Invalid port, see `help firewall` for more info");
    }

    if (ip && !(ip.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/) || ip === "*")) {
      throw new Error("Invalid ip, see `help firewall` for more info");
    }

    const rule = new FirewallRule(
      port,
      type === "in" ? "inbound" : "outbound",
      action
    );
    if (ip) rule.setIp(ip as Ip);

    system.firewall.addRule(rule);
  });

CommandManager.addDefaultCommand(firewall);
