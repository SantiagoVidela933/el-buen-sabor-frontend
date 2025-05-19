import Base from "../../Base";
import { IngredientCategory } from "./IngredientCategory";
import { MeasurementUnit } from "./MeasurementUnit";

export class Ingredient extends Base {
  constructor(
    id: number,
    public title: string,
    public ingredientCategory: IngredientCategory,
    public minStock: number,
    public currentStock: number,
    public measurementUnit: MeasurementUnit,
    public price: number,
    public available?: string,
    deleted?: boolean
  ) {
    super(id, deleted);
  }
}
