import Base from "../Base";
import { Address } from "./Address";
import { Phone } from "./Phone";
import { Role } from "./Role";

export class User extends Base {
  constructor(
    id: number,
    public lastName?: string,
    public name?: string,
    public userEmail?: string,
    public addresses?: Address[] | null,
    public phones?: Phone[] | null,
    public role?: Role,
    public auth0Id?: string,
    deleted?: boolean,
  ) {
    super(id, deleted);
  }
}
