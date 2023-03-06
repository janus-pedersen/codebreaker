import { setupStory } from "../story";
import { Network } from "./Network";
import { System } from "./System";

export interface GameEvents { 
  'systemChange': (system: System) => void;
}
export class Game {
  public network: Network = new Network();
  public currentSystem: System | null = null;
  public homeSystem: System | null = null;

  private listners = new Map<string, Function>();

  public constructor() {
    this.network = new Network();
    this.network.game = this;

    this.homeSystem = new System("localhost");
    this.currentSystem = this.homeSystem;
    this.network.addSystem(this.homeSystem);

    setupStory(this)
  }

  public on<T extends keyof GameEvents>(event: T, callback: GameEvents[T]) {
    this.listners.set(event, callback);
  }

  public emit<T extends keyof GameEvents>(event: T, ...args: Parameters<GameEvents[T]>) {
    const callback = this.listners.get(event);
    if (callback) {
      callback(...args);
    }
  }

  public setCurrentSystem(system: System) {
    this.currentSystem = system;
    this.emit('systemChange', system);
  }

  public home() {
    this.setCurrentSystem(this.homeSystem!);
  }

  public createRandomSystem() {
    const system = System.random();
    this.network.addSystem(system);
    return system;
  }
}
