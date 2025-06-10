import { BaseEntity } from "./BaseEntity";
import { Promocion } from "./Promocion";
import { PedidoVenta } from "./PedidoVenta";
import { Articulo } from "./Articulo";

export class PedidoVentaDetalle extends BaseEntity {
  cantidad: number;
  subtotal: number;
  subtotalCosto: number;
  promocion?: Promocion;
  pedidoVenta?: PedidoVenta;
  articulo?: Articulo;

  constructor(
    cantidad: number,
    subtotal: number,
    subtotalCosto: number,
    promocion?: Promocion,
    pedidoVenta?: PedidoVenta,
    articulo?: Articulo
  ) {
    super();
    this.cantidad = cantidad;
    this.subtotal = subtotal;
    this.subtotalCosto = subtotalCosto;
    this.promocion = promocion;
    this.pedidoVenta = pedidoVenta;
    this.articulo = articulo;
  }

  static fromJson(json: any): PedidoVentaDetalle {
    if (!json) return null;

    const promocion = json.promocion ? Promocion.fromJson(json.promocion) : undefined;
    const articulo = json.articulo ? Articulo.fromJson(json.articulo) : undefined;

    return new PedidoVentaDetalle(
      json.cantidad,
      json.subtotal,
      json.subtotalCosto,
      promocion,
      undefined, // No seteamos pedidoVenta para evitar ciclo
      articulo
    );
  }

  SubtotalCalculado(): number {
    return 0;
  }

  SubtotalCosto(): number {
    return 0;
  }
}
