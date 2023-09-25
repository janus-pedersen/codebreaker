import { PORTS } from "./utils/ports";
import { SystemFile } from "./classes/SystemFile";
import { SystemUpgrade } from "./classes/SystemUpgrade";
import { advancedScan } from "./classes/commands/market/advanced-scan";
import { Game } from "./classes/Game";
import { Store } from "./classes/Store";
import { StoreItem } from "./classes/StoreItem";
import { rooter } from "./classes/commands/market/rooter";
import { System } from "./classes/System";
import { AtmSystem } from "./classes/AtmSystem";
import {
  randomIp,
  randomNumber,
  randomPerson,
  randomString,
} from "./utils/random";
import { Ip, Pin } from "./types";
import { SystemUser } from "./classes/SystemUser";
import { PinSecurity } from "./classes/security/PinSecurity";
import { PasswordSecurity } from "./classes/securities/PasswordSecurity";
import { SystemDirectory } from "./classes/SystemDirectory";
import { ValuableFile } from "./classes/ValuableFile";
import { FirewallRule } from "./classes/Firewall";

function generateEmployeeUsers(amount: number): { name: string; pin: Pin }[] {
  const employees = [];

  for (let i = 0; i < amount; i++) {
    employees.push({
      name: randomPerson().firstName,
      pin: randomNumber(1000, 9999).toString() as Pin,
    });
  }

  return employees;
}

function lockFirewall(system: System, ports: number[]) {
  for (const port of ports) {
    const inbound = new FirewallRule(port, "inbound", "deny");
    const outbound = new FirewallRule(port, "outbound", "deny");
    system.firewall.addRule(inbound);
    system.firewall.addRule(outbound);
  }
}

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
    new StoreItem("Advanced Scan", 4900, advancedScan.description).setOnBuy(
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
      const atm = system.network?.get(ip as Ip);
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
      500,
      "We'll give you a tip on how to avoid court (reduce suspicion by 5%)"
    ).setOnBuy(() => {
      game.setSuspicion((s) => s - 5);
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
  lawyer.addItem(
    new StoreItem(
      "Presidential Pardon",
      52000,
      "We'll get you out of jail (reduce suspicion by 100%)"
    ).setOnBuy(() => {
      game.setSuspicion(() => 0);
    })
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
    )
      .setChance(Math.random() / 2 + 0.5)
      .setSuspicionPerSecond(0.25);
    const guest = new SystemUser("guest");
    atm.user.addSecurity(
      new PinSecurity(randomNumber(1000, 9999).toString() as Pin)
    );
    atm.users.push(guest);
    atm.setUser(guest);
    const acc = game.addSystem(atm);
    acc.deposit(randomNumber(200, 30000));
    atms.push(atm);
  }
  return atms;
}

export function starbucks(game: Game) {
  const system = new System("Starbucks");

  const employees = generateEmployeeUsers(randomNumber(2, 5));
  const users = employees.map((e) => {
    const user = new SystemUser(e.name);
    user.addSecurity(new PasswordSecurity(e.pin));
    return user;
  });
  const manager = new SystemUser("manager").addRoot();
  manager.addSecurity(new PasswordSecurity("password"));
  system.users = [];
  system.users.push(manager);
  system.users.push(...users);

  system.user = users[0];

  const secrets = new SystemDirectory("secrets");

  const customerInfo = new ValuableFile("customer-info.txt", 1000);
  customerInfo.write(
    [...Array(randomNumber(50, 150))]
      .map(() => {
        const name = randomPerson();
        const favCoffe = [
          "latte",
          "cappuccino",
          "espresso",
          "mocha",
          "americano",
        ][randomNumber(0, 4)];
        const totalSpent = randomNumber(100, 10000);
        return `${name} (${favCoffe}): ${totalSpent}`;
      })
      .join("\n")
  );
  customerInfo.setOwner(manager);
  secrets.addFile(customerInfo);

  const notes = new SystemFile(
    "notes.txt",
    "In case you need to access the manager account, the password is just \"password\". But don't tell anyone! You're not supposed to know that."
  );

  system.files.addFile(secrets);
  system.files.addFile(notes);

  lockFirewall(system, [PORTS.BANK, PORTS.FILE_TRANSFER]);

  system.setSuspicionPerSecond(0.9);

  const bankAcc = game.addSystem(system);
  bankAcc.deposit(randomNumber(1000, 10000));

  return system;
}

export function starbucksCorp(game: Game, starbucks: System) {
  const system = new System("Starbucks Corp.");
  system.setSuspicionPerSecond(1.5);

  lockFirewall(system, [
    PORTS.BANK,
    PORTS.CONNECT,
    PORTS.FILE_TRANSFER,
    PORTS.SCAN,
  ]);
  // Allow connections from Starbucks
  system.firewall.addRule(
    new FirewallRule(PORTS.SCAN, "inbound", "allow")
      .setIp(starbucks.ip)
      .setPriority(10)
  );
  system.firewall.addRule(
    new FirewallRule(PORTS.SCAN, "outbound", "allow")
      .setIp(starbucks.ip)
      .setPriority(10)
  );
  system.firewall.addRule(
    new FirewallRule(PORTS.CONNECT, "inbound", "allow")
      .setIp(starbucks.ip)
      .setPriority(10)
  );
  system.firewall.addRule(
    new FirewallRule(PORTS.CONNECT, "outbound", "allow")
      .setIp(starbucks.ip)
      .setPriority(10)
  );
  system.firewall.addRule(
    new FirewallRule(PORTS.FILE_TRANSFER, "inbound", "allow")
      .setIp(starbucks.ip)
      .setPriority(10)
  );
  system.firewall.addRule(
    new FirewallRule(PORTS.BANK, "inbound", "allow")
      .setIp(starbucks.ip)
      .setPriority(10)
  );
  system.firewall.addRule(
    new FirewallRule(PORTS.BANK, "outbound", "allow")
      .setIp(starbucks.ip)
      .setPriority(10)
  );

  const employees = generateEmployeeUsers(randomNumber(6, 12));
  const users = employees.map((e) => {
    const user = new SystemUser(e.name);
    user.addSecurity(new PasswordSecurity(e.pin));
    return user;
  });
  const itUser = new SystemUser("it admin").addRoot();
  itUser.addSecurity(new PasswordSecurity(randomString(8)));
  const manager = new SystemUser("manager").addRoot();
  manager.addSecurity(new PasswordSecurity("password"));
  system.users.push(manager);
  system.users.push(itUser);
  system.users.push(...users);

  system.user = users[0];

  const it = new SystemDirectory("it-files");
  let userFile = new ValuableFile("users.txt", 15000).write(
    employees.map((u) => `${u.name} (${u.pin})`).join("\n")
  );
  userFile.owner = itUser;
  it.addFile(userFile);
  it.addFile(
    new SystemFile(
      "system-reports.csv",
      [...Array(randomNumber(50, 150))]
        .map(
          () =>
            `${randomIp()}: ${randomNumber(0, 1000)},${randomNumber(
              0,
              1000
            )},${randomNumber(0, 1000)}`
        )
        .join("\n")
    )
  );  

  const bankAcc = game.addSystem(system);
  bankAcc.deposit(randomNumber(10000, 100000));
}

export function setupStory(game: Game) {
  lawyerStore(game);
  blackMarket(game);
  partsStore(game);

  addAtms(game, randomNumber(1, 4));

  const s = starbucks(game);
  starbucksCorp(game, s);

  return game;
}
