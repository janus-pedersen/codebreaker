import { PORTS } from "./../utils/ports";
import { System } from "./System";

export class Account {
  owner: System;
  balance: number;

  constructor(owner: System) {
    this.owner = owner;
    this.balance = 0;
  }

  deposit(amount: number) {
    this.balance += amount;
  }

	withdraw(amount: number) {
		
		if (amount > this.balance) {
			throw new Error("Insufficient funds");
		}

    this.balance -= amount;
  }
}

export class Bank {
  accounts: Account[] = [];

  createAccount(owner: System) {
    const account = new Account(owner);
    this.accounts.push(account);
    return account;
  }

  getAccount(owner: System) {
    return this.accounts.find((account) => account.owner === owner);
  }

  getAccounts() {
    return this.accounts;
  }

  getTotalBalance() {
    return this.accounts.reduce((total, account) => total + account.balance, 0);
  }

  transfer(from: System, to: System, amount: number) {
    const fromAccount = this.getAccount(from);
    const toAccount = this.getAccount(to);

    if (!fromAccount || !toAccount) {
      throw new Error("Account not found");
    }

    if (
      !(
        from.firewall.canAccess(to.ip, PORTS.BANK, "outbound") ||
        to.firewall.canAccess(from.ip, PORTS.BANK, "inbound")
      )
    ) {
      throw new Error("Cannot access bank");
    }

    fromAccount.withdraw(amount);
    toAccount.deposit(amount);
  }
}
