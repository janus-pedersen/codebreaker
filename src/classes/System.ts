import { CommandManager } from './CommandManager'
import { Terminal } from "./Terminal";
import './commands'
import { SystemUser } from './SystemUser';

export class System {
	public terminal: Terminal = new Terminal(this);
	public commandManager: CommandManager = new CommandManager();
	public user = new SystemUser('admin')

	constructor(public name: string) {}
}
