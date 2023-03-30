import { Command } from "../Command";
import { StringInput } from "../inputs/StringInput";
import { ValuableFile } from "../ValuableFile";

export const sell = new Command("sell")
	.setDescription("Sell a file")
	.setCategory("Economy")
	.setRoot()
	.addInput(new StringInput('file', 'File to sell', true))
	.onExec((system, file) => {
		const fileObj = system.getFile(file!);
		if (!fileObj) throw Error("No file found with that name");
		if(!(fileObj instanceof ValuableFile)) {
			throw Error(`You cannot sell this file`);
		}

		system.network?.game?.bank.getAccount(system)?.deposit(fileObj.value);
		system.terminal.success(`File sold for ${fileObj.value}$`, false);
		fileObj.sold = true;
		fileObj.value = 0;

	});
