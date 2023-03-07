import { PORTS } from "./utils/ports";
import { PasswordSecurity } from "./classes/securities/PasswordSecurity";
import { System } from "./classes/System";
import { Game } from "./classes/Game";
import { SystemUser } from "./classes/SystemUser";
import { randomNumber, randomPerson, randomString } from "./utils/random";
import { SystemDirectory } from "./classes/SystemDirectory";
import { SystemFile } from "./classes/SystemFile";
import { FirewallRule } from "./classes/Firewall";
import { Store } from "./classes/Store";
import { StoreItem } from "./classes/StoreItem";
export function setupStory(game: Game) {
  // Home system is created by default, so no need to create it here

  // You sit at home in your basement, scanning the internet for vulnerable systems, and you find a few.
  const starbucks = new System("starbucks");

  const managerPass = randomString();
  const employeePasswords = [randomString(), randomString(), randomString()];
  const starbucksManager = new SystemUser("manager")
    .addRoot()
    .addSecurity(new PasswordSecurity(managerPass));
  const starbucksEmployee1 = new SystemUser(
    randomPerson().firstName.toLowerCase()
  );
  const starbucksEmployee2 = new SystemUser(
    randomPerson().firstName.toLowerCase()
  ).addSecurity(new PasswordSecurity(employeePasswords[1]));
  const starbucksEmployee3 = new SystemUser(
    randomPerson().firstName.toLowerCase()
  ).addSecurity(new PasswordSecurity(employeePasswords[2]));

  starbucks.users.push(starbucksManager);
  starbucks.users.push(starbucksEmployee1);
  starbucks.users.push(starbucksEmployee2);
  starbucks.users.push(starbucksEmployee3);

  starbucks.setUser(starbucksEmployee1);
  starbucks.files.addFile(
    new SystemDirectory("employees", [
      new SystemDirectory(starbucksEmployee1.name),
      new SystemDirectory(starbucksEmployee2.name),
      new SystemDirectory(starbucksEmployee3.name),
    ])
  );

  starbucks.files.addFile(
    new SystemDirectory("secrets", [
      new SystemFile(
        "passwords.txt",
        `${starbucksManager.name}: ${managerPass}

${starbucksEmployee1.name}: ${employeePasswords[0]}
${starbucksEmployee2.name}: ${employeePasswords[1]}
${starbucksEmployee3.name}: ${employeePasswords[2]}
`
      ).setOwner(starbucksManager),
    ])
  );

  starbucks.files.addFile(
    new SystemFile(
      "notes.txt",
      `Incase you need it, the managers password is '${managerPass}'\nbut you probably shouldn't use it, they tend to get mad when you do that. \nAnd also, you can mess up the firewall and allow hackers through, so yeah. Don't do that.`
    )
  );

  starbucks.firewall.addRule(new FirewallRule(PORTS.BANK, "outbound", "deny"));
  starbucks.firewall.addRule(new FirewallRule(PORTS.BANK, "inbound", "deny"));
  starbucks.firewall.addRule(
    new FirewallRule(PORTS.CONNECT, "outbound", "deny")
  );
  starbucks.firewall.addRule(
    new FirewallRule(PORTS.FILE_TRANSFER, "inbound", "deny")
  );
  starbucks.firewall.addRule(
    new FirewallRule(PORTS.FILE_TRANSFER, "outbound", "deny")
  );

  const starbucksAcc = game.addSystem(starbucks);
  starbucksAcc.deposit(randomNumber(2000, 15000));

  const starbucksStore = new Store("Starbucks", starbucksAcc);
  starbucksStore.addItem(
    new StoreItem("Coffee", 5, "Coffee is good for you").setOnBuy(() => {})
  );
  starbucksStore.addItem(
    new StoreItem("Cookie", 6, "Sweet with little chocolate chips").setOnBuy(
      () => {}
    )
  );
  starbucksStore.addItem(
    new StoreItem("Muffin", 6, "A standard chocolate muffin").setOnBuy(() => {})
  );

  game.addStore(starbucksStore);

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
