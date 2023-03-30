import { SystemFile } from "./SystemFile";

export class ValuableFile extends SystemFile {
  public value: number;
  public sold = false;

  public constructor(name: string, value: number) {
    super(name);
    this.value = value;
  }
}
