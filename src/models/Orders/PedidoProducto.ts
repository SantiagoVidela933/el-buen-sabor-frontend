import { Product } from "../Products/Product";

export class PedidoProducto {
  product: Product;
  cantidad: number;

  constructor(product: Product, cantidad: number) {
    this.product = product;
    this.cantidad = cantidad;
  }
}
