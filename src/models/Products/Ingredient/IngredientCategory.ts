import Base from "../../Base";

export class IngredientCategory extends Base {
  constructor(
    id: number,
    public title: string,
    public parentCategory?: IngredientCategory,
    deleted?: boolean
  ) {
    super(id, deleted);
  }
}
