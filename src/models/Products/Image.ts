import Base from "../Base";

export class Image extends Base {
  constructor(
    id: number,
    public name: string,
    public path: string,
    deleted?: boolean,
  ) {
    super(id, deleted);
  }
}
