import { setupStory } from "../story";
import { randomNumber } from "../utils/random";
import { Bank } from "./Bank";
import { Network } from "./Network";
import { Store } from "./Store";
import { System } from "./System";

export interface GameEvents {
  systemChange: (system: System) => void;
  suspicionChange: (suspicion: number, old: number) => void;
}
export class Game {
  public network: Network = new Network();
  public bank: Bank = new Bank();
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
    this.currentSystem = this.homeSystem;
    const homeAcc = this.addSystem(this.homeSystem);
    homeAcc.deposit(9999999); // TODO: CHANGE!
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

  public addSystem(system: System) {
    this.network.addSystem(system);
    const bankAcc = this.bank.createAccount(system);

    return bankAcc;
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
