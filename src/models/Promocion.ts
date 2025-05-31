import { BaseEntity } from "./BaseEntity";
import { SucursalEmpresa } from "./SucursalEmpresa";
import { PromocionDetalle } from "./PromocionDetalle";
import { PedidoVentaDetalle } from "./PedidoVentaDetalle";
import { Imagen } from "./Imagen";

export class Promocion extends BaseEntity {
  denominacion: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  descuento: number;
  sucursal?: SucursalEmpresa;
  promocionesDetalle: PromocionDetalle[];
  pedidosVentaDetalle: PedidoVentaDetalle[];
  imagenes: Imagen[];

  constructor(
    denominacion: string,
    descuento: number,
    fechaDesde?: Date,
    fechaHasta?: Date,
    sucursal?: SucursalEmpresa,
    promocionesDetalle: PromocionDetalle[] = [],
    pedidosVentaDetalle: PedidoVentaDetalle[] = [],
    imagenes: Imagen[] = []
  ) {
    super();
    this.denominacion = denominacion;
    this.descuento = descuento;
    this.fechaDesde = fechaDesde;
    this.fechaHasta = fechaHasta;
    this.sucursal = sucursal;
    this.promocionesDetalle = promocionesDetalle;
    this.pedidosVentaDetalle = pedidosVentaDetalle;
    this.imagenes = imagenes;
  }
}
