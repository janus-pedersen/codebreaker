import { Game } from './Game';
import { PORTS } from "./../utils/ports";
import { System } from "./System";

export class Account {
  owner: System;
  balance: number;

  constructor(owner: System) {
    this.owner = owner;
    this.balance = 0;
  }

  /**
   * Increase the bank balance
   * @param amount the amount to deposit
   */
  deposit(amount: number) {
    this.balance += amount;
  }

  /**
   * Decrease the bank balance
   * @param amount the amount to withdraw
   */
	withdraw(amount: number) {
		
		if (amount > this.balance) {
			throw new Error("Insufficient funds");
		}

    this.balance -= amount;
  }
}

export class Bank {
  accounts: Account[] = [];
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  /** 
   * Create a bank account for a computer system
   * @param owner the owner of the account
   */
  createAccount(owner: System) {
    const account = new Account(owner);
    this.accounts.push(account);
    return account;
  }

  /**
   * Get a bank account for a computer system
   * @param owner the owner of the account
   */
  getAccount(owner: System) {
    return this.accounts.find((account) => account.owner === owner);
  }

  /**
   * Get all bank accounts
   */
  getAccounts() {
    return this.accounts;
  }

  /**
   * Get the total balance of all bank accounts
   */
  getTotalBalance() {
    return this.accounts.reduce((total, account) => total + account.balance, 0);
  }

  /**
   * Transfer money from one system to another
   * @param from the system to transfer from
   * @param to the system to transfer to
   * @param amount the amount to transfer
   */
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
