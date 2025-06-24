import { BaseEntity } from "./BaseEntity";
import { Promocion } from "./Promocion";
import { Articulo } from "./Articulo";

export class PromocionDetalle extends BaseEntity {
  cantidad: number;
  promocion?: Promocion;
  articulo?: Articulo;

  constructor(
    id: number,
    fechaAlta: string | null = null,
    fechaModificacion: string | null = null,
    fechaBaja: string | null = null,
    cantidad: number,
    promocion?: Promocion,
    articulo?: Articulo
  ) {
    super(id, fechaAlta, fechaModificacion, fechaBaja);
    this.cantidad = cantidad;
    this.promocion = promocion;
    this.articulo = articulo;
  }

  static fromJson(json: any): PromocionDetalle {
    return new PromocionDetalle(
      json.id ?? 0,
      json.fechaAlta ?? null,
      json.fechaModificacion ?? null,
      json.fechaBaja ?? null,
      json.cantidad,
      json.promocion ? Promocion.fromJson(json.promocion) : undefined,
      json.articulo ? Articulo.fromJson(json.articulo) : undefined
    );
  }
}
