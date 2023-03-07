import { setupStory } from "../story";
import { randomNumber } from "../utils/random";
import { Bank } from "./Bank";
import { Network } from "./Network";
import { Store } from "./Store";
import { System } from "./System";

export interface GameEvents {
  systemChange: (system: System) => void;
  suspicionChange: (suspicion: number) => void;
}
export class Game {
  public network: Network = new Network();
  public bank: Bank = new Bank();
  public market: Store[] = [];

  public currentSystem: System | null = null;
  public homeSystem: System | null = null;

  public suspicion = 0;

  private listeners = new Map<string, Function>();

  public constructor() {
    this.network = new Network();
    this.network.game = this;

    this.homeSystem = new System("localhost");
    this.currentSystem = this.homeSystem;
    const homeAcc = this.addSystem(this.homeSystem);
    homeAcc.deposit(randomNumber(10, 100));
    setupStory(this);
  }

  public addSystem(system: System) {
    this.network.addSystem(system);
    const bankAcc = this.bank.createAccount(system);

    return bankAcc;
  }

  public on<T extends keyof GameEvents>(event: T, callback: GameEvents[T]) {
    this.listeners.set(event, callback);
  }

  public emit<T extends keyof GameEvents>(
    event: T,
    ...args: Parameters<GameEvents[T]>
  ) {
    const callback = this.listeners.get(event);
    if (callback) {
      callback(...args);
    }
  }

  public setSuspicion(calc: (suspicion: number) => number) {
    this.suspicion = calc(this.suspicion);
    this.emit("suspicionChange", this.suspicion);
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
