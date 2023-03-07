import { PORTS } from './../../utils/ports';
import { Bank } from "./../Bank";
import { Ip } from "../../types";
import { Command } from "../Command";
import { NumberInput } from "../inputs/NumberInput";
import { StringInput } from "../inputs/StringInput";
import { CommandManager } from "../CommandManager";

export const transfer = new Command("transfer")
  .setDescription("Transfer money to another system")
  .addInput(new StringInput("ip", "The IP of the system to transfer to", true))
  .addInput(new NumberInput("amount", "The amount of money to transfer", true))
	.setCategory("Economy")
	.setRoot()
  .onExec((system, ip, amount) => {
    const targetSystem = system.network?.fromIp(ip as Ip);

    if (!targetSystem) {
      throw new Error("Invalid IP");
    }

    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
		}
		
		if (
			!system.firewall.canAccess(targetSystem.ip, PORTS.BANK, 'outbound') ||
			!targetSystem.firewall.canAccess(system.ip, PORTS.BANK, 'inbound')
		) {
			throw new Error("Cannot access target system, firewall blocked");
		}

    system.network?.game?.bank.transfer(system, targetSystem, amount as number);
  });

CommandManager.addDefaultCommand(transfer);