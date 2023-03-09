import { Command } from "./Command";
import { SystemFile } from "./SystemFile";

export class SystemCommandFile extends SystemFile {
  public command: Command;

  constructor(name: string, command: Command) {
    super(name + ".cmd", "");
    this.command = command;
  }
}
