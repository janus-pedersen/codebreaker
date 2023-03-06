import { CommandInput } from ".";

export class NumberInput<Required extends boolean> extends CommandInput<number> {
  validate(): boolean {
    return true;
  }

  parse(input: string): number {
    return Number(input.trim());
	}
	
  _?: Required extends true ? number : number | undefined;

  constructor(
    public name = "number",
    public description = "A number",
    public required: Required = false as Required
  ) {
    super();
  }
}
