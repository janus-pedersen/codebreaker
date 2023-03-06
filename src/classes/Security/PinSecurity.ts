import { Pin } from "../../types";
import { System } from "../System";
import { SecurityMeasure } from "./SecurityMeasure";

export class PinSecurity extends SecurityMeasure {
  private pin: Pin = "0000";

  public constructor(pin: Pin) {
    super();
    this.pin = pin;
	}
	
	public async tryPass(system: System) {
		const pin = await system.terminal.ask('Enter pin:')
		return pin === this.pin
	}
}
