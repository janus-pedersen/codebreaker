import { SystemUpgrade } from "./classes/SystemUpgrade";
import { advancedScan } from "./classes/commands/market/advanced-scan";
import { Game } from "./classes/Game";
import { Store } from "./classes/Store";
import { StoreItem } from "./classes/StoreItem";
import { rooter } from "./classes/commands/market/rooter";
import { System } from "./classes/System";
import { AtmSystem } from "./classes/AtmSystem";
import { randomNumber } from "./utils/random";
import { Ip, Pin } from "./types";
import { SystemUser } from "./classes/SystemUser";
import { PinSecurity } from "./classes/security/PinSecurity";

export function blackMarket(game: Game) {
  const blackMarket = new Store("Black Market");
  blackMarket.addItem(
    new StoreItem("Rooter", 28000, rooter.description).setOnBuy((system) => {
      if (system.commandManager.getCommand(rooter.name))
        throw Error("You already have this command!");
      system.commandManager.addCommand(rooter);
      system.setCommandManager(system.commandManager);
    })
  );
  blackMarket.addItem(
    new StoreItem("Advanced Scan", 1200, advancedScan.description).setOnBuy(
      (system) => {
        if (system.commandManager.getCommand(advancedScan.name))
          throw Error("You already have this command!");
        system.commandManager.addCommand(advancedScan);
        system.setCommandManager(system.commandManager);
      }
    )
  );

  blackMarket.addItem(
    new StoreItem(
      "ATM Skimmer",
      2100,
      "Install a skimmer on an ATM that will steal money continuously"
    ).setOnBuy(async (system) => {
      const ip = await system.terminal.ask(
        "Enter the IP of the ATM to install the skimmer on"
      );
      const atm = system.network?.fromIp(ip as Ip);
      if (!(atm instanceof AtmSystem)) {
        throw Error("No ATM found with that IP");
      }

      if (atm.skimmerInstalled) {
        throw Error("Skimmer already installed");
      }

      atm.skimmerInstalled = true;
      system.terminal.success("Skimmer installed", false);
    })
  );

  game.addStore(blackMarket);
}

export function lawyerStore(game: Game) {
  const lawyer = new Store("Jame n' Sons Law Firm");
  lawyer.addItem(
    new StoreItem(
      "Legal Advice",
      100,
      "We'll give you a tip on how to avoid court (reduce suspicion by 1%)"
    ).setOnBuy(() => {
      game.setSuspicion((s) => s - 1);
    })
  );
  lawyer.addItem(
    new StoreItem(
      "Legal Defense",
      1000,
      "We'll help you with your legal problems (reduce suspicion by 10%)"
    ).setOnBuy(() => {
      game.setSuspicion((s) => s - 10);
    })
  );
  lawyer.addItem(
    new StoreItem(
      "Personal Lawyer",
      5000,
      "We work for you 24/7 (reduce suspicion by 1% every 5 seconds)"
    )
      .setOnBuy(() => {
        game.setSuspicion((s) => s - 1);
        setInterval(() => {
          game.setSuspicion((s) => Math.max(0, s - 1));
        }, 5000);
      })
      .setOneTime()
  );

  game.addStore(lawyer);
}

export function partsStore(game: Game) {
  const store = new Store("Parts Store");

  const basicVPN = new SystemUpgrade(
    "Basic VPN",
    "A vpn that reduces the effects of suspicion"
  );
  basicVPN.suspicionMultiplier = 0.9;
  const basicVPNItem = new StoreItem("Basic VPN", 999, basicVPN.description)
    .setOnBuy((system) => {
      system.addUpgrade(basicVPN);
    })
    .setOneTime();

  const premiumVPN = new SystemUpgrade(
    "Premium VPN",
    "A vpn that further reduces the effects of suspicion"
  );
  premiumVPN.suspicionMultiplier = 0.75;
  const premiumVPNItem = new StoreItem(
    "Premium VPN",
    5200,
    premiumVPN.description
  )
    .setOnBuy((system) => {
      system.addUpgrade(premiumVPN);
    })
    .setOneTime();

  const fasterCpu = new SystemUpgrade(
    "Faster CPU",
    "A faster CPU that increases the speed of your system"
  );
  fasterCpu.timeMultiplier = 0.5;
  const fasterCpuItem = new StoreItem("Faster CPU", 1600, fasterCpu.description)
    .setOnBuy((system) => {
      system.addUpgrade(fasterCpu);
    })
    .setOneTime();

  const insaneCpu = new SystemUpgrade(
    "Insane CPU",
    "An insane CPU that further increases the speed of your system"
  );
  insaneCpu.timeMultiplier = 0.2;
  const insaneCpuItem = new StoreItem(
    "Insane CPU",
    48000,
    insaneCpu.description
  )
    .setOnBuy((system) => {
      system.upgrades = system.upgrades.filter(
        (u) => u.name !== fasterCpu.name
      );
      system.addUpgrade(insaneCpu);
    })
    .setOneTime();

  store.addItem(basicVPNItem);
  store.addItem(premiumVPNItem);
  store.addItem(fasterCpuItem);
  store.addItem(insaneCpuItem);

  game.addStore(store);
}

export function addAtms(game: Game, amount: number) {
  const atms = [];
  for (let i = 0; i < amount; i++) {
    const atm = new AtmSystem(
      `${randomNumber(0, 9999).toString().padStart(4, "0")}`
    ).setChance(Math.random() / 2);
    const guest = new SystemUser('guest')
    atm.user.addSecurity(new PinSecurity(randomNumber(1000, 9999).toString() as Pin))
    atm.users.push(guest)
    atm.setUser(guest)
    const acc = game.addSystem(atm);
    acc.deposit(randomNumber(200, 30000));
    atms.push(atm);
  }
  return atms;
}

export function setupStory(game: Game) {
  lawyerStore(game);
  blackMarket(game);
  partsStore(game);

  addAtms(game, randomNumber(4, 12));

  game.addSystem(new System("Perker"));
  return game;
}
