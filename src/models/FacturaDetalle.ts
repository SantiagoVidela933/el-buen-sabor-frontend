import { BaseEntity } from "./BaseEntity";
import { Factura } from "./Factura";
import { Articulo } from "./Articulo";

export class FacturaDetalle extends BaseEntity {
  factura: Factura | null;
  articulo: Articulo | null;

  constructor(factura: Factura | null = null, articulo: Articulo | null = null) {
    super();
    this.factura = factura;
    this.articulo = articulo;
  }
}
