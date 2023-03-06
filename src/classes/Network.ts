import { System } from "../classes/System";
import { Ip } from "../types";
import { PORTS } from "../utils/ports";

export class Network {
  private ips = new Map<string, System>();
  private hostnames = new Map<string, System>();

  public addSystem(system: System) {
    this.ips.set(system.ip, system);
    this.hostnames.set(system.name, system);
  }

  public fromIp(ip: Ip) {
    return this.ips.get(ip);
  }

  public fromHostname(hostname: string) {
    return this.hostnames.get(hostname);
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
