import Base from "../Base";

export class Recipe extends Base {
  constructor(
    id: number,
    public description: string,
    deleted?: boolean,
  ) {
    super(id, deleted);
  }
}
