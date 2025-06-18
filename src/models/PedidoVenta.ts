import { BaseEntity } from "./BaseEntity";
import { PedidoVentaDetalle } from "./PedidoVentaDetalle";
import { Factura } from "./Factura";
import { SucursalEmpresa } from "./SucursalEmpresa";
import { Domicilio } from "./Domicilio";
import { Cliente } from "./Cliente";
import { Empleado } from "./Empleado";
import { Estado } from "./enums/Estado";
import { TipoEnvio } from "./enums/TipoEnvio";
import { FormaPago } from "./enums/FormaPago";

export class PedidoVenta extends BaseEntity {
  fechaPedido: Date;
  horaPedido: string;
  estado: Estado;
  tipoEnvio: TipoEnvio;
  gastoEnvio: number;
  formaPago: FormaPago;
  descuento: number;
  totalCosto: number;
  totalVenta: number;

  pedidosVentaDetalle: PedidoVentaDetalle[];
  factura: Factura[];

  sucursal?: SucursalEmpresa;
  domicilio?: Domicilio;
  cliente?: Cliente;
  empleado?: Empleado;

  constructor(
    fechaPedido: Date,
    horaPedido: string,
    estado: Estado,
    tipoEnvio: TipoEnvio,
    gastoEnvio: number,
    formaPago: FormaPago,
    descuento: number,
    totalCosto: number,
    totalVenta: number,
    pedidosVentaDetalle: PedidoVentaDetalle[] = [],
    facturas: Factura[] = [],
    sucursal?: SucursalEmpresa,
    domicilio?: Domicilio,
    cliente?: Cliente,
    empleado?: Empleado
  ) {
    super();
    this.fechaPedido = fechaPedido;
    this.horaPedido = horaPedido;
    this.estado = estado;
    this.tipoEnvio = tipoEnvio;
    this.gastoEnvio = gastoEnvio;
    this.formaPago = formaPago;
    this.descuento = descuento;
    this.totalCosto = totalCosto;
    this.totalVenta = totalVenta;
    this.pedidosVentaDetalle = pedidosVentaDetalle;
    this.factura = facturas;
    this.sucursal = sucursal;
    this.domicilio = domicilio;
    this.cliente = cliente;
    this.empleado = empleado;
  }

  static fromJson(json: any): PedidoVenta | null {
    if (!json) return null;

    const fechaPedido = json.fechaPedido ? new Date(json.fechaPedido) : new Date();

    const hp = json.horaPedido || { hour: 0, minute: 0, second: 0, nano: 0 };
    const horaPedido = 
      String(hp.hour).padStart(2, '0') + ':' +
      String(hp.minute).padStart(2, '0') + ':' +
      String(hp.second).padStart(2, '0');

    const detalles = (json.pedidosVentaDetalle || []).map((d: any) =>
      PedidoVentaDetalle.fromJson(d)
    );

    const facturas = (json.factura || []).map((f: any) =>
      Factura.fromJson(f)
    );

    
    const domicilio = json.domicilio ? Domicilio.fromJson(json.domicilio) ?? undefined : undefined;
    const cliente = json.cliente ? Cliente.fromJson(json.cliente) ?? undefined : undefined;
    const empleado = json.empleado ? Empleado.fromJson(json.empleado) ?? undefined : undefined;
    const sucursal = json.sucursal ? SucursalEmpresa.fromJson(json.sucursal) : undefined;

    return new PedidoVenta(
      fechaPedido,
      horaPedido,
      json.estado,
      json.tipoEnvio,
      json.gastoEnvio,
      json.formaPago,
      json.descuento,
      json.totalCosto,
      json.totalVenta,
      detalles,
      facturas,
      sucursal,
      domicilio,
      cliente,
      empleado
    );
  }

  HoraFinalizacion(): string {
    return this.horaPedido;
  }

  DescuentosCalculados(): number {
    return 0;
  }

  TotalCalculado(): number {
    return 0;
  }

  TotalCosto(): number {
    return 0;
  }
}
