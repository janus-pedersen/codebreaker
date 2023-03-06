import { PORTS } from './utils/ports';
import { PasswordSecurity } from "./classes/security/PasswordSecurity";
import { System } from "./classes/System";
import { Game } from "./classes/Game";
import { SystemUser } from "./classes/SystemUser";
import { randomPerson, randomString } from "./utils/random";
import { SystemDirectory } from "./classes/SystemDirectory";
import { SystemFile } from "./classes/SystemFile";
import { FirewallRule } from "./classes/Firewall";
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

	starbucks.firewall.addRule(new FirewallRule(PORTS.BANK, 'outbound', 'deny'))
	starbucks.firewall.addRule(new FirewallRule(PORTS.BANK, 'inbound', 'deny'))
	starbucks.firewall.addRule(new FirewallRule(PORTS.SSH, 'outbound', 'deny'))
	starbucks.firewall.addRule(new FirewallRule(PORTS.FTP, 'inbound', 'deny'))
	starbucks.firewall.addRule(new FirewallRule(PORTS.FTP, 'outbound', 'deny'))

	game.network.addSystem(starbucks);
}
