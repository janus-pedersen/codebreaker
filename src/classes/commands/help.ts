import { createElement } from "react";
import { Command } from "../Command";
import { CommandManager } from "../CommandManager";
import { CommandInput } from "../inputs";
import { StringInput } from "../inputs/StringInput";

export const help = new Command("help")
  .setDescription(
    "Shows a list of commands, or information about a specific command"
  )
  .addInput(new StringInput("command", "The command to get help for", false))
  .onExec((system, command) => {
    if (!command) {
      const commands = system.commandManager.commands
        .sort((a, b) => a.name.localeCompare(b.name))
				.sort((a, b) => a.category.localeCompare(b.category));
			let lastCategory = ''
			for (const cmd of commands) {
				if (cmd.category !== lastCategory) {
					system.terminal.pushColored('white', cmd.category, false)
					lastCategory = cmd.category
				}


        const name = createElement(
          "span",
          { style: { color: "white", opacity: 0.8 } },
          "  " + cmd.name
        );
        const description = createElement(
          "span",
          { style: { color: "teal", opacity: 0.9 } },
          cmd.description
        );
        system.terminal.pushHistory(
          createElement(
            "div",
            { style: { display: "flex" } },
            name,
            " - ",
            description
          ) as any
        );
      }
    } else {
      const cmd = system.commandManager.getCommand(command);
      if (!cmd) {
        system.terminal.pushColored("red", "No command found with that name");
        return;
      }
      system.terminal.pushStyled(
        {
          color: "white",
          textDecoration: "underline",
        },
        cmd.name,
        false
      );
      system.terminal.pushColored("teal", cmd.description, false);
      system.terminal.pushStyled({}, " ", false);

      if (cmd.inputs.length > 0) {
        system.terminal.pushStyled(
          {
            color: "white",
            textDecoration: "underline",
          },
          "Inputs:",
          false
        );
      }

      for (const input of cmd.inputs) {
        const i = input as CommandInput;

        system.terminal.pushColored(
          "white",
          "  " + i.name + (!i.required ? "?" : ""),
          false
        );
        system.terminal.pushColored("teal", "    " + i.description, false);
      }
    }
  });

CommandManager.addDefaultCommand(help);
