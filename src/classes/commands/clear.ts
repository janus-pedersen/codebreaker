import { CommandManager } from '../CommandManager';
import { Command } from './../Command';
export const clear = new Command('clear')
	.setDescription('Clears the terminal')
	.onExec((system) => {
		system.terminal.clear();
	});

CommandManager.addDefaultCommand(clear);