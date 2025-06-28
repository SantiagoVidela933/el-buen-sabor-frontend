import Base from "../Base";

export class Role extends Base {
  constructor(
    id: number,
    public desciption: string,
    public auth0RoleId?: string,
    deleted?: boolean,
  ) {
    super(id, deleted);
  }
}
