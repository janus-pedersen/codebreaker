import { System } from "../classes/System";
import { Ip } from "../types";
import { PORTS } from "../utils/ports";
import { Game } from "./Game";

export class Network {
  private ips = new Map<string, System>();
  private hostnames = new Map<string, System>();
  public game?: Game;

  public addSystem(system: System) {
    this.ips.set(system.ip, system);
    this.hostnames.set(system.name, system);
    system.network = this;
  }

  public connect(from: System, to: Ip) {
    const target = this.fromIp(to);
    if (!target) {
      throw Error("System not found");
    }

    if (!target.firewall.canAccess(from.ip, PORTS.CONNECT, "inbound")) {
      throw Error("Access denied");
    }

    if (this.game?.currentSystem?.ip === to) {
      throw Error("Already connected to this system");
    }

    if (
      !this.game?.currentSystem?.firewall.canAccess(to, PORTS.CONNECT, "outbound")
    ) {
      throw Error("Access denied");
    }

    this.game.setCurrentSystem(target);
  }

  public fromIp(ip: Ip) {
    return this.ips.get(ip.trim());
  }

  public fromHostname(hostname: string) {
    return this.hostnames.get(hostname.trim());
  }

  public get(n: string) {
    return this.fromHostname(n) || this.fromIp(n as Ip);
  }

  public getSystems() {
    return Array.from(this.ips.values());
  }

  public getIps() {
    return Array.from(this.ips.keys());
  }

  public getHostnames() {
    return Array.from(this.hostnames.keys());
  }

  scan(from: System) {
    let systems = this.getSystems().filter((s) =>
      s.firewall.canAccess(from.ip, PORTS.SCAN, "inbound")
    );
    return systems;
  }
}
