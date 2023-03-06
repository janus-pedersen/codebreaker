import { CommandInput } from "./classes/inputs";
import { System } from "./classes/System";

export type Pin = `${number}`;

export type CommandInputs = CommandInput<any>[];
export type CommandExecArgs<T extends CommandInputs> = {
	[K in keyof T]: T[K]["_"];
};

export type CommandExec<T extends CommandInputs> = (
	currentSystem: System,
  ...args: CommandExecArgs<T>
) => void;
