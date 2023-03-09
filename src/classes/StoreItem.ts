import { System } from "./System";

export class StoreItem {
  public name: string;
  public price: number;
  public description: string;
  public bought: boolean = false;
  public isOneTime: boolean = false;

  private onBuy: (system: System) => void | Promise<void> = () => {
    throw Error("No onBuy function set");
  };

  public constructor(name: string, price: number, description: string) {
    this.name = name;
    this.price = price;
    this.description = description;
	}
	
	public setOneTime() {
		this.isOneTime = true;
		return this;
	}

  public setOnBuy(onBuy: (system: System) => void) {
    this.onBuy = onBuy;
    return this;
  }

  public async buy(system: System) {
    if (this.bought) {
      throw Error("You already bought this item");
    }

    try {
      if (this.onBuy) {
        await this.onBuy(system);
      }
      system.network?.game?.bank.getAccount(system)?.withdraw(this.price);
      system.terminal.success(
        `You bought ${this.name} for $${this.price}`,
        false
      );
      if (this.isOneTime) this.bought = true;
    } catch (e) {
      system.terminal.error((e as any).message, false);
    }
  }
}
