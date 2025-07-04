import { BaseEntity } from "./BaseEntity";
import { PromocionDetalle } from "./PromocionDetalle";
import { PedidoVentaDetalle } from "./PedidoVentaDetalle";
import { Imagen } from "./Imagen";
import { SucursalEmpresaPromocion } from "./SucursalEmpresaPromocion";

export class Promocion extends BaseEntity {
  denominacion: string;
  descripcion: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  descuento: number;
  sucursal?: SucursalEmpresaPromocion;
  promocionesDetalle: PromocionDetalle[];
  pedidosVentaDetalle: PedidoVentaDetalle[];
  imagenes: Imagen[];

  constructor(
    id: number,
    fechaAlta: string | null = null,
    fechaModificacion: string | null = null,
    fechaBaja: string | null = null,
    denominacion: string,
    descripcion: string,
    descuento: number,
    fechaDesde?: Date,
    fechaHasta?: Date,
    sucursal?: SucursalEmpresaPromocion,
    promocionesDetalle: PromocionDetalle[] = [],
    pedidosVentaDetalle: PedidoVentaDetalle[] = [],
    imagenes: Imagen[] = [],
  ) {
    super(id, fechaAlta, fechaModificacion, fechaBaja);
    this.denominacion = denominacion;
    this.descripcion = descripcion;
    this.descuento = descuento;
    this.fechaDesde = fechaDesde;
    this.fechaHasta = fechaHasta;
    this.sucursal = sucursal;
    this.promocionesDetalle = promocionesDetalle;
    this.pedidosVentaDetalle = pedidosVentaDetalle;
    this.imagenes = imagenes;
  }

  static fromJson(json: any): Promocion {
    const fechaDesde = json.fechaDesde ? new Date(json.fechaDesde) : undefined;
    const fechaHasta = json.fechaHasta ? new Date(json.fechaHasta) : undefined;
    const sucursal = SucursalEmpresaPromocion.fromJson(json.sucursal);
    const promocionesDetalle = (json.promocionesDetalle ?? []).map((pd: any) => PromocionDetalle.fromJson(pd));
    const pedidosVentaDetalle = (json.pedidosVentaDetalle ?? []).map((pvd: any) => PedidoVentaDetalle.fromJson(pvd));
    const imagenes = (json.imagenes ?? []).map((img: any) => Imagen.fromJson(img));

    return new Promocion(
      json.id ?? 0,
      json.fechaAlta ?? null,
      json.fechaModificacion ?? null, 
      json.fechaBaja ?? null,
      json.denominacion,
      json.descripcion,
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
