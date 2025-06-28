import Base from "../Base";

export class Location extends Base {
  constructor(
    id: number,
    public name: string,
    deleted?: boolean,
  ) {
    super(id, deleted);
  }
}
