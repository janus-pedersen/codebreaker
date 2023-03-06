import { SecurityMeasure } from "./SecurityMeasure";
import { System } from "./System";

export class SystemUser {
  public name: string;
  public security: SecurityMeasure[] = [];
  public hasRoot = false;

  public constructor(name: string) {
    this.name = name;
  }

  public addRoot() {
    this.hasRoot = true;
    return this
  }

  public addSecurity(security: SecurityMeasure) {
    this.security.push(security);
    return this
  }

  public async login(currentSystem: System): Promise<boolean> {
    for (const security of this.security) {
      if (!(await security.tryPass(currentSystem))) {
        return false;
      }
    }

    return true;
  }
}
