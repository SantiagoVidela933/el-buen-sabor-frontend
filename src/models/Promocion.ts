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

  static fromJson(json: any): Promocion {
    if (!json) return null;

    const fechaDesde = json.fechaDesde ? new Date(json.fechaDesde) : undefined;
    const fechaHasta = json.fechaHasta ? new Date(json.fechaHasta) : undefined;
    const sucursal = json.sucursal ? SucursalEmpresa.fromJson(json.sucursal) : undefined;
    const promocionesDetalle = (json.promocionesDetalle ?? []).map((pd: any) => PromocionDetalle.fromJson(pd));
    const pedidosVentaDetalle = (json.pedidosVentaDetalle ?? []).map((pvd: any) => PedidoVentaDetalle.fromJson(pvd));
    const imagenes = (json.imagenes ?? []).map((img: any) => Imagen.fromJson(img));

    return new Promocion(
      json.denominacion,
      json.descuento,
      fechaDesde,
      fechaHasta,
      sucursal,
      promocionesDetalle,
      pedidosVentaDetalle,
      imagenes
    );
  }
}
