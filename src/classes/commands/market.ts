import { CommandManager } from "./../CommandManager";
import { createElement } from "react";
import { Command } from "./../Command";
export const market = new Command("market")
  .setDescription("Opens the market")
  .setCategory("Economy")
  .setRoot()
  .onExec(async (system) => {
    const stores = system.network?.game?.market;

    if (!stores) {
      throw new Error("No market found");
    }

    system.terminal.info("Stores: ", false);

    stores.forEach((store, index) => {
      const indexDisplay = createElement(
        "span",
        { style: { color: "DarkCyan" } },
        index
      );
      const nameDisplay = createElement(
        "span",
        {},
        indexDisplay,
        ": " + store.storeName
      );
      system.terminal.pushHistory(nameDisplay as any);
    });

    system.terminal.blank();

    const storeName = await system.terminal.ask(
      "Which store would you like to visit?"
    );
    const store = stores.find(
      (store, i) =>
        store.storeName.toLowerCase() === storeName.toLowerCase() ||
        i === parseInt(storeName)
    );

    if (!store) {
      throw new Error("No store found with that name");
    }

    system.terminal.info("Items: ", false);
    const bal = system.network?.game?.bank.getAccount(system)?.balance;

    store.items.sort((a,b) => a.price - b.price).forEach((item, index) => {
      const indexDisplay = createElement(
        "span",
        { style: { color: "DarkCyan" } },
        index
      );
      const nameDisplay = createElement(
        "span",
        {},
        indexDisplay,
        ": ",
        createElement(
          "span",
          { style: { color: item.price > bal! ? "Tomato" : "ForestGreen" } },
          "$" + item.price
        ),
        " ",
        createElement(
          "span",
          {
            style: {
              color: "white",
              textDecoration: item.bought ? "line-through" : "",
            },
          },
          item.name
        ),
        " - ",
        createElement(
          "span",
          {
            style: {
              color: "LightGray",
              opacity: 0.7,
              textDecoration: item.bought ? "line-through" : "",
            },
          },
          item.description
        )
      );
      system.terminal.pushHistory(nameDisplay as any);
    });

    system.terminal.blank();

    const itemName = await system.terminal.ask(
      "Which item would you like to buy?"
    );

    const item = store.items.find(
      (item, i) =>
        item.name.toLowerCase() === itemName.toLowerCase() ||
        i === parseInt(itemName)
    );

    if (!item) {
      throw new Error("No item found with that name");
    }

    const confirmPurchase: () => Promise<boolean> = async () => {
      const c = await system.terminal.ask(
        `Are you sure you want to buy ${item.name} for $${item.price}? (y/n)`
      );

      if (c.toLowerCase() === "y") {
        return true;
      } else if (c.toLowerCase() === "n") {
        return false;
      } else {
        return await confirmPurchase();
      }
    };

    const confirmed = await confirmPurchase();

    if (!confirmed) {
      throw new Error("Purchase cancelled");
    }

    const account = system.network?.game?.bank.getAccount(system);

    if (!account) {
      throw new Error("No bank account found");
    }

    if (account.balance < item.price) {
      throw new Error("Not enough money");
    }

    await store.buyItem(system, item.name);
  });

CommandManager.addDefaultCommand(market);
