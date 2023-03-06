import { Network } from "./Network";
import { System } from "./System";
export class Game {
  public network: Network = new Network();
  public currentSystem: System | null = null;
  public homeSystem: System | null = null;

  public constructor() {
    this.network = new Network();

    this.homeSystem = new System("home");
    this.currentSystem = this.homeSystem;
    this.network.addSystem(this.homeSystem);
  }
}
