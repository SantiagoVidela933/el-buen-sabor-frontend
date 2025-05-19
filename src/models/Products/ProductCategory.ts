import Base from "../Base";

export class ProductCategory extends Base {
  constructor(
    id: number,
    public description: string,
    public parentCategory?: ProductCategory,
    public available?: string,
    deleted?: boolean
  ) {
    super(id, deleted);
  }
}
