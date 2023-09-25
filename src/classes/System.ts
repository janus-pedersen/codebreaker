import { SystemUpgrade } from "./SystemUpgrade";
import { Firewall } from "./Firewall";
import { SystemFile } from "./SystemFile";
import { CommandManager } from "./CommandManager";
import { Terminal } from "./Terminal";
import "./commands";
import { SystemUser } from "./SystemUser";
import { SystemDirectory } from "./SystemDirectory";
import { randomBusinessName, randomIp, randomString } from "../utils/random";
import { Network } from "./Network";
import { PasswordSecurity } from "./securities/PasswordSecurity";
import { SystemCommandFile } from "./SystemCommandFile";

/**
 * A system is a computer that the player can connect to and hack into
 */
export class System {
  public terminal: Terminal = new Terminal(this);
  public commandManager: CommandManager;
  public user = new SystemUser("root").addRoot();
  public users = [this.user];
  public files = new SystemDirectory("");
  public currentDirectory = "";
  public ip = randomIp();
  public firewall = new Firewall();
  public network?: Network;
  public suspicionPerSecond = 0;
  public upgrades: SystemUpgrade[] = [];

  constructor(public name: string) {
    this.commandManager = new CommandManager();
    this.setCommandManager(this.commandManager);

    this.terminal.emit("setup");

    this.files.addFile(new SystemFile("README.md", `# ${name}`));
  }

  /**
   * Generates a random system that can be used for buffering the story
   */
  static random() {
    const sys = new System(randomBusinessName());
    const guest = new SystemUser("guest");
    const pass = randomString(8);
    sys.user.addSecurity(new PasswordSecurity(pass));
    sys.users.push(guest);
    sys.setUser(guest);
    sys.files.addFile(
      new SystemFile("root-password.txt", "Password: \n" + pass)
    );
    return sys;
  }

  addUpgrade(upgrade: SystemUpgrade) {
    this.upgrades.push(upgrade);
    return this;
  }

  /**
   * Sets the suspicion per second, this is the amount of suspicion that is added to the system every second when the player is connected to it
   */
  setSuspicionPerSecond(suspicionPerSecond: number) {
    this.suspicionPerSecond = suspicionPerSecond;
    return this;
  }

  setCommandManager(commandManager: CommandManager) {
    this.commandManager = commandManager;

    let bin = this.files.files.find(
      (file) => file.name === "bin"
    ) as SystemDirectory;
    if (!bin) {
      bin = new SystemDirectory("bin");
      this.files.addFile(bin);
    } else {
      bin.files = [];
    }

    for (const command of commandManager.commands) {
      bin.addFile(new SystemCommandFile(command.name, command));
    }
  }

  /**
   * Changes the user, and attempts to login to that user if the password is correct
   */
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

  /** Backend for the `cd` command */
  changeDirectory(path: string) {
    if (path === "/") {
      this.currentDirectory = "";
      this.terminal.updatePrompt();
      return;
    }

    if (path === "..") {
      const pathParts = this.currentDirectory
        .split("/")
        .filter((part) => part !== "");
      pathParts.pop();
      this.currentDirectory = pathParts.join("/");
      this.terminal.updatePrompt();
      return;
    }

    if (!path.startsWith("/")) path = this.currentDirectory + "/" + path;
    const directory = this.getDirectory(path);
    if (!directory) return this.terminal.error("No such directory");
    this.currentDirectory = path;
    this.terminal.updatePrompt();
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
