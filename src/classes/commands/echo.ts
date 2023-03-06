import { Command } from "../Command";
import { CommandManager } from "../CommandManager";
import { StringInput } from "../inputs/StringInput";

export const echo = new Command("echo")
  .addInput(new StringInput("message", "The message to echo", true))
  .setDescription("Echoes a message")
  .onExec((system, message) => {
    if (!message) throw new Error("No message provided");

    system.terminal.basic(message, false)
  });

CommandManager.addDefaultCommand(echo);
