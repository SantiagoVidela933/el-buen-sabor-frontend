import Base from "../Base";

export class Category extends Base {
  constructor(
    id: number,
    public name: string,
    public parentCategory: Category,
    deleted?: boolean,
  ) {
    super(id, deleted);
  }
}
