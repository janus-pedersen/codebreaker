import { CommandExec, CommandExecArgs, CommandInputs } from "./../types";
import { CommandInput } from "./inputs";
export class Command<Inputs extends CommandInputs = []> {
  name: string;
  description: string = "";
  aliases: string[] = [];
  inputs: Inputs = [] as unknown as Inputs;
  exec: CommandExec<Inputs> = () => {
    throw new Error("Command not implemented");
  };

  constructor(name: string) {
    this.name = name;
  }

  addInput<Type, I extends CommandInput<Type>>(input: I) {
    if (
      input.required &&
      this.inputs.length > 0 &&
      !this.inputs[this.inputs.length - 1].required
    ) {
      throw new Error("Required inputs must come before optional inputs");
    }

    this.inputs.push(input);
    return this as unknown as Command<[...Inputs, I]>;
  }

  setDescription(description: string) {
    this.description = description;
    return this;
  }

  setAliases(...aliases: string[]) {
    this.aliases = aliases;
    return this;
  }

  onExec(callback: CommandExec<Inputs>) {
    this.exec = callback;
    return this;
  }

  parseArgs(args: RegExpMatchArray): CommandExecArgs<Inputs> {
    let parsed: CommandExecArgs<Inputs> = [] as any;
    args.forEach((arg, i) => {
      const input = this.inputs[i];
      if (!input) {
        throw new Error(`Too many arguments provided for command ${this.name}`);
      }
      parsed.push(input.parse(arg));
    });

    let missedInputs = this.inputs.slice(args.length);
    if (missedInputs.some((input) => input.required)) {
      throw new Error(`Not enough arguments provided for command ${this.name}`);
    }

    return parsed as CommandExecArgs<Inputs>;
  }
}
