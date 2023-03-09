import { SystemFile } from "./SystemFile";

export class SystemDirectory {
  constructor(
    public name: string,
    public files: (SystemFile | SystemDirectory)[] = []
  ) {}

  addFile(file: SystemFile | SystemDirectory) {
    this.files.push(file);
    return this;
  }

  hasFile(name: string) {
    return this.files.some((file) => file.name === name);
  }

  getFile(name: string) {
    return this.files.find((file) => file.name === name);
  }

  countFiles() {
    let count = 0;
    for (const file of this.files) {
      if (file instanceof SystemDirectory) {
        count += file.countFiles();
      } else {
        count++;
      }
    }
    return count;
  }
}
