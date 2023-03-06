import { createElement } from 'react';
import { Command } from "../Command";
import { CommandManager } from "../CommandManager";
import { StringInput } from "../inputs/StringInput";

export const help = new Command("help")
  .setDescription(
    "Shows a list of commands, or information about a specific command"
  )
  .addInput(new StringInput("command", "The command to get help for", false))
  .onExec((system, command) => {
    if (!command) {
      system.terminal.pushStyled(
        {
          color: "white",
          textDecoration: "underline",
        },
        "Commands:",
        false
      );

      for (const cmd of system.commandManager.commands) {
				const name = createElement('span', { style: { color: 'white', opacity: 0.8 } }, "  " + cmd.name)
				const description = createElement('span', { style: { color: 'teal', opacity: 0.9 } }, cmd.description)
				system.terminal.pushHistory(createElement('div', {style: {display: "flex"}}, name, ' - ', description) as any);
      }
    }
  });

CommandManager.addDefaultCommand(help);
