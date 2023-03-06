import { SecurityMeasure } from "./Security/SecurityMeasure";
import { System } from "./System";

export class SystemUser {
  public name: string;
  public security: SecurityMeasure[] = [];

  public constructor(name: string) {
    this.name = name;
  }

  public addSecurity(security: SecurityMeasure) {
    this.security.push(security);
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
