import Base from "../Base";

export class Phone extends Base {
  constructor(
    id: number,
    public number: string,
    deleted?: boolean,
  ) {
    super(id, deleted);
  }
}
