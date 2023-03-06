import { Command } from './../Command';
export const scan = new Command('scan')
	.setDescription('Scans the network for systems with an open \'scan\' port')
	.setCategory('Network')
	.setRoot()
