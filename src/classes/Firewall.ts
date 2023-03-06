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
    const rule = this.rules.find(
      (r) => (r.port === "*" || r.port === port) && r.type === type
    );
    if (!rule) return true;
    if (rule.action === "deny") return false;
    if (!rule.ip || rule.ip === "*") return true;
    return rule.ip === ip;
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
  }

  setIp(ip: Ip | "*") {
    this.ip = ip;
  }
}
