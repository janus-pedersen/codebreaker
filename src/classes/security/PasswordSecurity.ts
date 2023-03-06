import { System } from "../System";
import { SecurityMeasure } from "./SecurityMeasure";

export class PasswordSecurity extends SecurityMeasure {
  private pass: string = "password";

  public constructor(pass?: string) {
    super();
    this.pass = pass || this.pass;
	}
	
	public async tryPass(system: System) {
		const pass = await system.terminal.ask('Enter password:')
		return pass === this.pass
	}
}
