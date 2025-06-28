import { BaseEntity } from "./BaseEntity";
import { PedidoVenta } from "./PedidoVenta";
import { FacturaDetalle } from "./FacturaDetalle";
import { DatoMercadoPago } from "./DatoMercadoPago";
import { Cliente } from "./Cliente";
import { SucursalEmpresa } from "./SucursalEmpresa";
import { FormaPago } from "./enums/FormaPago";

export class Factura extends BaseEntity {
  fechaFacturacion: Date | null;
  nroComprobante: number | null;
  formaPago: FormaPago | null;
  descuento: number | null;
  gastoEnvio: number | null;
  totalVenta: number | null;
  pedidoVenta: PedidoVenta | null;
  facturaDetalles: Set<FacturaDetalle>;
  datoMercadoPago: DatoMercadoPago | null;
  cliente: Cliente | null;
  sucursal: SucursalEmpresa | null;

  constructor(
    fechaFacturacion: Date,
    nroComprobante: number,
    formaPago: FormaPago | null = null,
    descuento: number | null = null,
    gastoEnvio: number | null = null,
    totalVenta: number | null = null,
    pedidoVenta: PedidoVenta | null = null,
    facturaDetalles: Set<FacturaDetalle> = new Set(),
    datoMercadoPago: DatoMercadoPago | null = null,
    cliente: Cliente | null = null,
    sucursal: SucursalEmpresa | null = null
  ) {
    super();
    this.fechaFacturacion = fechaFacturacion;
    this.nroComprobante = nroComprobante;
    this.formaPago = formaPago;
    this.descuento = descuento;
    this.gastoEnvio = gastoEnvio;
    this.totalVenta = totalVenta;
    this.pedidoVenta = pedidoVenta;
    this.facturaDetalles = facturaDetalles;
    this.datoMercadoPago = datoMercadoPago;
    this.cliente = cliente;
    this.sucursal = sucursal;
  }

  static fromJson(json: any): Factura | null {
    if (!json) return null;

    const fechaFacturacion = json.fechaFacturacion ? new Date(json.fechaFacturacion) : null;

    // Para facturaDetalles que es un Set<FacturaDetalle>
    const detalles = new Set<FacturaDetalle>();
    if (Array.isArray(json.facturaDetalles)) {
      json.facturaDetalles.forEach((fd: any) => {
        if (FacturaDetalle.fromJson) {
          detalles.add(FacturaDetalle.fromJson(fd));
        } else {
          detalles.add(fd);
        }
      });
    }

    const pedidoVenta = json.pedidoVenta ? PedidoVenta.fromJson(json.pedidoVenta) : null;
    const datoMercadoPago = json.datoMercadoPago ? DatoMercadoPago.fromJson(json.datoMercadoPago) : null;
    const cliente = json.cliente ? Cliente.fromJson(json.cliente) : null;
    const sucursal = json.sucursal ? SucursalEmpresa.fromJson(json.sucursal) : null;

    return new Factura(
      fechaFacturacion,
      json.nroComprobante ?? null,
      json.formaPago ?? null,
      json.descuento ?? null,
      json.gastoEnvio ?? null,
      json.totalVenta ?? null,
      pedidoVenta,
      detalles,
      datoMercadoPago,
      cliente,
      sucursal
    );
  }


  descuentosCalculados(): number {
    return 0;
  }

  totalCalculado(): number {
    return 0;
  }

  totalCosto(): number {
    return 0;
  }
}
