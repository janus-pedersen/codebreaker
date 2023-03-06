export class SystemFile {
  private content: string = "";
  constructor(public name: string, content?: string) {
    if (content) this.content = content;
  }

  read() {
    return this.content;
  }

  write(content: string) {
    this.content = content;
  }
}
