import { PORTS } from "./../../utils/ports";
import { Ip } from "../../types";
import { Command } from "../Command";
import { NumberInput } from "../inputs/NumberInput";
import { StringInput } from "../inputs/StringInput";
import { CommandManager } from "../CommandManager";
import { randomNumber } from "../../utils/random";

export const transfer = new Command("transfer")
  .setDescription("Transfer money to another system")
  .addInput(new StringInput("ip", "The IP of the system to transfer to", true))
  .addInput(new NumberInput("amount", "The amount of money to transfer", true))
  .setCategory("Economy")
  .setRoot()
  .onExec((system, ip, amount) => {
    const targetSystem = system.network?.get(ip as Ip);

    if (!targetSystem) {
      throw new Error("Invalid IP");
    }

    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    if (
      !system.firewall.canAccess(targetSystem.ip, PORTS.BANK, "outbound") ||
      !targetSystem.firewall.canAccess(system.ip, PORTS.BANK, "inbound")
    ) {
      throw new Error("Cannot access target system, firewall blocked");
    }

    system.network?.game?.bank.transfer(system, targetSystem, amount as number);

    system.terminal.success(
      `Transferred $${amount} to ${targetSystem.name}`,
      false
    );

    // Calculate a suspicion value based on the amount of money transferred, plus a tiny bit of randomness
    const suspicion = (amount / 1000) + randomNumber(0, 100) / 100;
    system.network?.game?.setSuspicion((sus) => sus + suspicion);
  });

CommandManager.addDefaultCommand(transfer);
