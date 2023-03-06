import { CommandInput } from ".";

export class StringInput<Required extends boolean> extends CommandInput<string> {
  validate(): boolean {
    return true;
  }

  parse(input: string): string {
    return input.trim();
	}
	
  _?: Required extends true ? string : string | undefined;

  constructor(
    public name = "string",
    public description = "A string",
    public required: Required = false as Required
  ) {
    super();
  }
}
