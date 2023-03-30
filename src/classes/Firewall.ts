import { Ip } from "./../types";
type FirewallRuleType = "inbound" | "outbound";

export class Firewall {
  rules: FirewallRule[] = [];

  public addRule(rule: FirewallRule) {
    // Check for conflicting rules
    for (const r of this.rules) {
      if (r.port === rule.port && r.ip === rule.ip && r.type === rule.type) {
        if (r.action === rule.action) {
          throw new Error("Rule already exists");
        } else {
          this.removeRule(r);
        }
      }
    }

    this.rules.push(rule);
  }

  public removeRule(rule: FirewallRule) {
    this.rules = this.rules.filter((r) => {
      return r !== rule;
    });
  }

  public getRules(): FirewallRule[] {
    return this.rules;
  }

  public canAccess(ip: Ip, port: number, type: FirewallRuleType) {
    let lowestPriority = -Infinity;
    let lowestPriorityRule: FirewallRule | undefined = undefined;

    for (const rule of this.rules) {
      if (rule.port === port && rule.type === type) {
        if (rule.ip === ip || rule.ip === "*") {
          if (rule.priority > lowestPriority) {
            lowestPriority = rule.priority;
            lowestPriorityRule = rule;
          }
        }
      }
    }

    if (lowestPriorityRule) {
      return lowestPriorityRule.action === "allow";
    } else {
      return true;
    }
  }
}

export class FirewallRule {
  port: number | "*";
  type: FirewallRuleType;
  action: "allow" | "deny";
  ip?: Ip | "*";
  priority: number = 0;

  constructor(
    port: number | "*",
    type: FirewallRuleType,
    action: "allow" | "deny"
  ) {
    this.port = port;
    this.type = type;
    this.action = action;
    this.ip = "*";
  }

  setPriority(priority: number) {
    this.priority = priority;
    return this
  }

  setIp(ip: Ip | "*") {
    this.ip = ip;
    return this;
  }
}
