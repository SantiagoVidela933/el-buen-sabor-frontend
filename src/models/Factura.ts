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
