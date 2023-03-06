import { System } from './../System';

export abstract class SecurityMeasure {
	abstract tryPass(system: System): boolean | Promise<boolean>;
}
