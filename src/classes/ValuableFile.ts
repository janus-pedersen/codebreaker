import { SystemFile } from "./SystemFile";

/** A file that has a monetary value */
export class ValuableFile extends SystemFile {
  public value: number;
  public sold = false;

  public constructor(name: string, value: number) {
    super(name);
    this.value = value;
  }
}
