import { Ip } from "../../types";
import { Command } from "../Command";
import { CommandManager } from "../CommandManager";
import { StringInput } from "../inputs/StringInput";

export const connect = new Command("connect")
  .setDescription("Connect to a system")
  .setCategory("Network")
  .setRoot()
  .addInput(new StringInput("ip", "IP Address to connect to"))
  .onExec((system, ip) => {
    try {
      system.network?.connect(system, ip! as Ip);
    } catch (e) {
      system.terminal.error((e as any).message, false);
    }
  });

CommandManager.addDefaultCommand(connect);
