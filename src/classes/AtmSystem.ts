import { randomNumber } from "../utils/random";
import { wait } from "../utils/wait";
import { System } from "./System";

export class AtmSystem extends System {
  public skimmerInstalled = false;

  private chanceOfSkimmer = 0.1;

  public constructor(name: string) {
    super(`ATM-${name}`);

    (async () => {
      while (true) {
        if (this.skimmerInstalled) {
          try {
            const amount = randomNumber(500, 500);
            console.log("Stealing " + amount + " from " + this.name);
            this.network?.game?.bank.getAccount(this)?.withdraw(amount);
            this.network?.game?.bank
              .getAccount(this.network.game.homeSystem!)
              ?.deposit(amount);
          } catch (e) {}
				}
				await wait(randomNumber(4000, 25000))
      }
    })();
  }

  public setChance(chance: number) {
    this.chanceOfSkimmer = chance;
    return this;
  }

  public installSkimmer() {
    this.skimmerInstalled = true;
    return this;
  }
}
