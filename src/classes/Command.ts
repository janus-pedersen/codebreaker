import { CommandExec, CommandExecArgs, CommandInputs } from "./../types";
import { CommandInput } from "./inputs";
export class Command<Inputs extends CommandInputs = []> {
  /** The name used for the command, the one you input to execute it */
  name: string;
  description: string = "";

  /** Alternate names that can also be used */
  aliases: string[] = [];

  /** Inputs that the command takes, such as an ip address or the amount of money to transfer */
  inputs: Inputs = [] as unknown as Inputs;
  requiresRoot: boolean = false;
  category: string = "General";
  suspicion: number = 0;

  /** The funciton to execute when the command is called */
  exec: CommandExec<Inputs> = () => {
    throw new Error("Command not implemented");
  };

  constructor(name: string) {
    this.name = name;
  }

  setSuspicion(suspicion: number) {
    this.suspicion = suspicion;
    return this;
  }

  setRoot(root: boolean = true) {
    this.requiresRoot = root;
    return this;
  }

  setCategory(category: string) {
    this.category = category;
    return this;
  }

  /** Adds an input */
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

  /** Parse teh arguments and see if they match the required arguments */
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
