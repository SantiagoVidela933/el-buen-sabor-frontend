import Base from "../Base";
import { Product } from "../Products/Product";

export class Order extends Base {

  public products: { product: Product; quantity: number }[];
  
  constructor(
    id: number,
    public date: string,
    public total: number,
    public orderStatus: "Entregado" | "En preparación" | "En camino" | "Cancelado",
    public paid: boolean,
    products: { product: Product; quantity: number }[] = [],
    deleted?: boolean
  ) {
    super(id, deleted);
    this.products = products;
  }
}
