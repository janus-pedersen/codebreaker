import { Command } from "../../Command";

export const rooter = new Command("rooter")
	.setDescription("Forcefully root a system (very suspicious)")
	.setCategory("Black Market")
	.setSuspicion(50)
	.onExec((system) => {

		if (system.user.hasRoot) {
			throw Error("System already rooted");
		}

		system.user.hasRoot = true;
		system.terminal.success("System rooted", false);
	});