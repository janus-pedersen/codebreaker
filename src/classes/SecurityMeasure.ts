import { System } from './System';

export abstract class SecurityMeasure {
	/**
	 * Let the user attempt to pass the security measure, returns true if passed successfully
	 */
	abstract tryPass(system: System): boolean | Promise<boolean>;
}
