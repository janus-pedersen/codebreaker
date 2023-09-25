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
            if(Math.random() > this.chanceOfSkimmer) return;
            const amount = randomNumber(300, 1500);
            this.network?.game?.bank.getAccount(this)?.withdraw(amount);
            this.network?.game?.bank
            .getAccount(this.network.game.homeSystem!)
            ?.deposit(amount);
            this.network?.game?.notify(`Skimmer stole $${amount} from ${this.name}!`)
          } catch (e) {}
				}
				await wait(randomNumber(4000, 25000))
      }
    })();
  }

  /**
   * Set the profitability of atm skimmers
   * @param chance the change that the user receives cash
   * @returns 
   */
  public setChance(chance: number) {
    this.chanceOfSkimmer = chance;
    return this;
  }

  public installSkimmer() {
    this.skimmerInstalled = true;
    return this;
  }
}
