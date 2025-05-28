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
  facturas: Factura[];

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
    this.facturas = facturas;
    this.sucursal = sucursal;
    this.domicilio = domicilio;
    this.cliente = cliente;
    this.empleado = empleado;
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
