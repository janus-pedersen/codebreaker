import { createElement } from 'react';
import { PORTS } from "../../utils/ports";
import { Command } from "../Command";
import { CommandManager } from "../CommandManager";

export const ports = new Command("ports")
  .setDescription(
    "List the different ports that are used in the game, and what they are used for"
  )
  .setCategory("Network")
  .onExec((system) => {
    Object.entries(PORTS).forEach(([key, value]) => {
			const span = createElement("span", { style: { color: "white" } }, `${key}: `, createElement("span", { style: { color: "lightgreen" } }, `${value}`));
			system.terminal.pushHistory(span as any, false);
    });
	});
	
CommandManager.addDefaultCommand(ports);
