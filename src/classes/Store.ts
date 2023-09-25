import { System } from "./System";
import { StoreItem } from "./StoreItem";
import { Account } from "./Bank";

export class Store {
  public storeName: string;
  public items: StoreItem[] = [];
  public bankAcc?: Account;

  public constructor(storeName: string, bankAcc?: Account) {
    this.storeName = storeName;
    this.bankAcc = bankAcc;
  }

  public addItem(item: StoreItem) {
    this.items.push(item);
    return this;
  }

  /**
   * Buys an item and subtracts the money from the bank account
   * @param system the system to link the item to
   * @param itemName item to buy
   */
  public async buyItem(system: System, itemName: string) {
    const item = this.items.find((item) => item.name === itemName);
    if (!item) {
      throw Error("Item not found");
    }

    system.terminal.basic(`Buying ${item.name} for $${item.price} on system: ${system.name}`, false);

    await item.buy(system);

    if (this.bankAcc) {
      this.bankAcc.deposit(item.price);
    }
  }
}
