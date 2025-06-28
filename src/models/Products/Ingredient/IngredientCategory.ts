import Base from "../../Base";

export class IngredientCategory extends Base {
  constructor(
    id: number,
    public title: string,
    public parentCategory?: IngredientCategory,
    public available?: string,
    deleted?: boolean
  ) {
    super(id, deleted);
  }
}
