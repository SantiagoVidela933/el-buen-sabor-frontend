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

  static fromJson(json: any): FacturaDetalle | null {
    if (!json) return null;

    const factura = json.factura ? Factura.fromJson(json.factura) : null;
    const articulo = json.articulo ? Articulo.fromJson(json.articulo) : null;

    return new FacturaDetalle(factura, articulo);
  }
}
