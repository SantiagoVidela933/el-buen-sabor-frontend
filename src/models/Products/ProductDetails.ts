import Base from "../Base";
import { Ingredient } from "./Ingredient/Ingredient";

export class ProductDetails extends Base {
  constructor(
    id: number,
    public ingredient: Ingredient,
    public quantity: number | "",
    public measurementUnit: string,
    deleted?: boolean,
  ) {
    super(id, deleted);
  }
}
