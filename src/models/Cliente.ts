import { BaseEntity } from "./BaseEntity";
import { Usuario } from "./Usuario";
import { Domicilio } from "./Domicilio";
import { PedidoVenta } from "./PedidoVenta";
import { Factura } from "./Factura";

export class Cliente extends BaseEntity {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaDeNacimiento: string; 

  usuario: Usuario;
  domicilio: Domicilio;
  pedidosVenta: PedidoVenta[];
  facturas: Factura[];

  constructor(
    nombre: string,
    apellido: string,
    telefono: string,
    email: string,
    fechaDeNacimiento: string,
    usuario: Usuario,
    domicilio: Domicilio,
    pedidosVenta: PedidoVenta[] = [],
    facturas: Factura[] = []
  ) {
    super();
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.email = email;
    this.fechaDeNacimiento = fechaDeNacimiento;
    this.usuario = usuario;
    this.domicilio = domicilio;
    this.pedidosVenta = pedidosVenta;
    this.facturas = facturas;
  }

  static fromJson(json: any): Cliente | null {
  if (!json) return null;

  const usuario = json.usuario ? Usuario.fromJson(json.usuario) : null;
  const domicilio = json.domicilio ? Domicilio.fromJson(json.domicilio) : null;
  const pedidosVenta = (json.pedidosVenta || []).map((pv: any) => PedidoVenta.fromJson(pv));
  const facturas = (json.facturas || []).map((f: any) => Factura.fromJson(f));

  return new Cliente(
    json.nombre,
    json.apellido,
    json.telefono,
    json.email,
    json.fechaDeNacimiento,
    usuario!,
    domicilio!,
    pedidosVenta,
    facturas
  );
}

}
