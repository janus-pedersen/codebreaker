import { CommandManager } from "../CommandManager";
import { Command } from "../Command";
import { createElement } from "react";

export const bal = new Command("bal")
  .setDescription("Checks your balance")
	.setCategory("Economy")
	.setRoot()
  .onExec((system) => {
    const span = createElement(
      "span",
      { style: { color: "SeaGreen" } },
      `$${system.network?.game?.bank.getAccount(system)?.balance.toFixed(2)}`
    );

    system.terminal.pushHistory(
      createElement(
        "span",
        { style: { color: "LightGray" } },
        "Your account balance is: ",
        span
      ) as any
    );
  });

CommandManager.addDefaultCommand(bal);
