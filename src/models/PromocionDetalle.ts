import { BaseEntity } from "./BaseEntity";
import { Promocion } from "./Promocion";
import { Articulo } from "./Articulo";

export class PromocionDetalle extends BaseEntity {
  cantidad: number;
  promocion?: Promocion;
  articulo?: Articulo;

  constructor(
    cantidad: number,
    promocion?: Promocion,
    articulo?: Articulo
  ) {
    super();
    this.cantidad = cantidad;
    this.promocion = promocion;
    this.articulo = articulo;
  }

  static fromJson(json: any): PromocionDetalle {
    if (!json) return null;

    return new PromocionDetalle(
      json.cantidad,
      json.promocion ? Promocion.fromJson(json.promocion) : undefined,
      json.articulo ? Articulo.fromJson(json.articulo) : undefined
    );
  }
}
