import { SystemUser } from "./SystemUser";
export class SystemFile {
  private content: string = "";
  private owner?: SystemUser;
  constructor(public name: string, content?: string) {
    if (content) this.content = content;
  }

  setOwner(user: SystemUser) {
    this.owner = user;
    return this;
  }

  read(user: SystemUser) {
    if (this.owner && this.owner.name !== user.name) {
      throw Error("Permission denied");
    }

    return this.content;
  }

  write(content: string) {
    this.content = content;
  }
}
