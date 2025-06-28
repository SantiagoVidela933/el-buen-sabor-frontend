import Base from "../Base";

export class Address extends Base {
  constructor(
    id: number,
    public number: string,
    public street: string,
    public location: Location,
    deleted?: boolean,
  ) {
    super(id, deleted);
  }
}
