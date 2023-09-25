import { notifications } from "@mantine/notifications";
import { setupStory } from "../story";
import { randomNumber } from "../utils/random";
import { Bank } from "./Bank";
import { sell } from "./commands/sell";
import { Network } from "./Network";
import { Store } from "./Store";
import { System } from "./System";
import { SystemFile } from "./SystemFile";

export interface GameEvents {
  systemChange: (system: System) => void;
  suspicionChange: (suspicion: number, old: number) => void;
}
export class Game {
  public network: Network = new Network();
  public bank: Bank = new Bank(this);
  public market: Store[] = [];
  public systemSuspicionInterval: NodeJS.Timeout | null = null;

  public currentSystem: System | null = null;
  public homeSystem: System | null = null;

  public suspicion = 0;

  private listeners = new Map<string, Function[]>();

  public constructor() {
    this.network = new Network();
    this.network.game = this;

    this.homeSystem = new System("localhost");
    this.homeSystem.commandManager.addCommand(sell as any)
    this.homeSystem.files.addFile(new SystemFile("tutorial.md", `
      # Welcome to the game!
      This is a game about hacking, and you're the hacker! You'll be using the terminal to hack into systems, steal money, and more!

      ## Getting started
      To get started, use the \`cat tutorial.md\` command to read this tutorial. You can also use the \`help\` command to get a list of commands.

      Important commands:
        - scan - Scan for systems on the network
        - connect - Connect to a system
        - home - Go back to your home system
        - ls - List files in the current directory
        - cd - Change directory
        - cat - Read a file

      ## Hacking
      To hack into a system, you'll need to use the \`connect\` command. This will connect you to a system, and you'll be able to use commands to hack into it. 
      You can use the \`scan\` command to find systems on the network.

      Once you're connected to a system, the goal is to get root access. This means you'll have full control over the system, 
      and you'll be able to do whatever you want. To get root access, you'll need to find a way to get the root password. 
      You can do this by reading files, or using other commands (the fun part).
      When you're ready use the \`user root\` command to switch to the root user.

      ## Making money
      Making money is the main goal of the game. You can make money by selling files, or by hacking into systems and stealing money.
      If there are any files with values (show up in green with \`ls\` command), you can transfer them with the \`ftp\` command. 
      You can sell files using the \`sell\` command (on your own computer). You can also use the \`transfer\` command to transfer money between systems.

      ## Skimmers
      Skimmers are a great way to make money. You can install them on ATM systems, and they'll steal money from people who use the ATM.
      Skimmers can be purchased from the black market.

      ## Markets
      There are multiple markets in the game, they can probide you with useful tools, or even skimmers. You can use the \`market\` command to view the markets.


      ## Other
      The \`help\` command is almost always useful, so make sure to use it if you're stuck.
    `))
    this.currentSystem = this.homeSystem;
    const homeAcc = this.addSystem(this.homeSystem);
    homeAcc.deposit((Math.random() * 800) + 50);
    setupStory(this);

    this.on("systemChange", () => {
      if (this.systemSuspicionInterval) {
        clearInterval(this.systemSuspicionInterval);
      }
			this.systemSuspicionInterval = setInterval(() => {
				console.log("Suspicion: " + this.suspicion)
        this.setSuspicion((suspicion) => suspicion + (this.currentSystem?.suspicionPerSecond || 0));
      }, 1000);
    });
  }

  /**
   * Show a notification to the user
   * @param message The message to show
   * @param color The color of the notification
   */
  public notify(message: string, color: string = 'green') {
    notifications.show({
      message,
      color,
      styles: {
        description: {
          color: "LightGray",
          fontFamily: "monospace",
          fontSize: "1.1rem",
          padding: "md"
        },

        root: {
          margin: "2rem",
          backgroundColor: "#16191f",
          boxShadow: "5px 5px 10px 0 rgba(0, 0, 0, 0.5)",
        },

        closeButton: {
          color: "white",
        }
      }
    })
  }

  /** Register a system to the game */
  public addSystem(system: System) {
    this.network.addSystem(system);
    return this.bank.createAccount(system);
  }

  public on<T extends keyof GameEvents>(event: T, callback: GameEvents[T]) {
    this.listeners.set(event, [...(this.listeners.get(event) || []), callback]);
  }

  public emit<T extends keyof GameEvents>(
    event: T,
    ...args: Parameters<GameEvents[T]>
  ) {
    const callback = this.listeners.get(event);
		if (callback) {
			for (const cb of callback) {
				cb(...args);
			}
    }
  }

  /**
   * Set the users suspicion level
   * @param calc The function to calculate the new suspicion level
   */
  public setSuspicion(calc: (suspicion: number) => number) {
    const oldSuspicion = this.suspicion;
    this.suspicion = calc(this.suspicion);
    this.emit("suspicionChange", this.suspicion, oldSuspicion);

    const warnings = [50, 75, 90, 96, 99];
    for (const warning of warnings) {
      if (oldSuspicion < warning && this.suspicion >= warning) {
        this.currentSystem?.terminal.error(
          `Suspicion level is now ${Math.floor(this.suspicion)}%, watch out!`,
          false
        );
      }
    }

    if (this.suspicion >= 100) {
      this.end();
    }
  }

  public async end() {
    this.currentSystem!.terminal.history = [];

    const insults = [
      "Get good",
      "Script kiddie",
      "Try harder",
      "Git gud",
      "Caught in 4k",
      "Noob",
      "You suck",
      "You're bad",
      "You're trash",
    ];

		this.currentSystem!.terminal.error(
			insults[randomNumber(0, insults.length - 1)] +
			", you got caught by the FBI!",
      false
    );
    this.currentSystem!.terminal.basic("Refresh the page to try again", false);
    this.currentSystem?.terminal.ignoreNext(Infinity);
  }

  /** Change the sustem, used with the `connect` command */
  public setCurrentSystem(system: System) {
    this.currentSystem = system;
    this.emit("systemChange", system);
  }

  public home() {
    this.setCurrentSystem(this.homeSystem!);
  }

  public createRandomSystem() {
    const system = System.random();
    this.network.addSystem(system);
    return system;
  }

  public addStore(store: Store) {
    this.market.push(store);
  }

  public getStore(name: string) {
    return this.market.find((store) => store.storeName === name);
  }
}
