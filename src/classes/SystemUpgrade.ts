export class SystemUpgrade {
	name: string;
	description: string;

	suspicionMultiplier: number = 1;
	timeMultiplier: number = 1;

	constructor(name: string, description: string) {
		this.name = name;
		this.description = description;
	}
}