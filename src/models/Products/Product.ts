import Base from "../Base";
import { Image } from "./Image";
import { ProductCategory } from "./ProductCategory";
import { ProductDetails } from "./ProductDetails";
import { Recipe } from "./Recipe";

export class Product extends Base {
  constructor(
    id: number,
    public title: string,
    public description: string,
    public price: number,
    public productCategory: ProductCategory,
    public productDetails?: ProductDetails[],
    public available?: boolean,
    public cookingTime?: number | "",
    public recipe?: Recipe, 
    public image?: Image,
    deleted?: boolean
  ) {
    super(id, deleted);
  }
}
