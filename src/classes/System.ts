import { Firewall } from "./Firewall";
import { SystemFile } from "./SystemFile";
import { CommandManager } from "./CommandManager";
import { Terminal } from "./Terminal";
import "./commands";
import { SystemUser } from "./SystemUser";
import { SystemDirectory } from "./SystemDirectory";
import { randomIp } from "../utils/random";

export class System {
  public terminal: Terminal = new Terminal(this);
  public commandManager: CommandManager;
  public user = new SystemUser("admin").addRoot();
  public users = [this.user];
  public files = new SystemDirectory("");
  public currentDirectory = "";
  public ip = randomIp();
  public firewall = new Firewall();

  constructor(public name: string) {
    this.commandManager = new CommandManager(); // just for TS
    this.setCommandManager(new CommandManager());

    this.files.addFile(new SystemFile("README.md", `# ${name}`));
  }

  setCommandManager(commandManager: CommandManager) {
    this.commandManager = commandManager;

    let bin = this.files.files.find(
      (file) => file.name === "bin"
    ) as SystemDirectory;
    if (!bin) {
      bin = new SystemDirectory("bin");
      this.files.addFile(bin);
    }

    for (const command of commandManager.commands) {
      bin.addFile(new SystemFile(command.name, command.description));
    }
  }

  async setUser(user: SystemUser) {

    if (user.name === this.user.name) {
      throw Error("Already logged in as that user");
    }

    if (await user.login(this)) {
      this.terminal.success(`Logged in as ${user.name}`);
      this.user = user;
    } else {
      throw Error("Incorrect authentication");
    }
  }

  changeDirectory(path: string) {
    if (path === "/") {
      this.currentDirectory = "";
      return;
    }

    if (path === "..") {
      const pathParts = this.currentDirectory
        .split("/")
        .filter((part) => part !== "");
      pathParts.pop();
      this.currentDirectory = pathParts.join("/");
      return;
    }

    if (!path.startsWith("/")) path = this.currentDirectory + "/" + path;
    const directory = this.getDirectory(path);
    if (!directory) return this.terminal.error("No such directory");
    this.currentDirectory = path;
  }

  getDirectory(path: string) {
    let currentDirectory = this.files;
    const pathParts = path.split("/").filter((part) => part !== "");

    for (const pathPart of pathParts) {
      if (pathPart === "") continue;
      const directory = currentDirectory.files.find(
        (file) => file.name === pathPart && file instanceof SystemDirectory
      ) as SystemDirectory;
      if (!directory) return null;
      currentDirectory = directory;
    }

    return currentDirectory;
  }

  getFile(path: string) {
    const directory = this.getDirectory(this.currentDirectory);
    if (!directory) return null;
    return directory.files.find((file) => file.name === path) as SystemFile;
  }
}
