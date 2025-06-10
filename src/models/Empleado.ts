import { BaseEntity } from "./BaseEntity";
import { Usuario } from "./Usuario";
import { SucursalEmpresa } from "./SucursalEmpresa";
import { Domicilio } from "./Domicilio";
import { PedidoVenta } from "./PedidoVenta";
import { Rol } from "./enums/Rol";

export class Empleado extends BaseEntity {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  rol: Rol;
  usuario: Usuario;
  sucursal: SucursalEmpresa;
  domicilio: Domicilio;
  pedidosVenta: PedidoVenta[];

  constructor(
    nombre: string,
    apellido: string,
    telefono: string,
    email: string,
    usuario: Usuario,
    sucursal: SucursalEmpresa,
    domicilio: Domicilio,
    pedidosVenta: PedidoVenta[] = [],
    rol: Rol,
  ) {
    super();
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.email = email;
    this.rol = rol;
    this.usuario = usuario;
    this.sucursal = sucursal;
    this.domicilio = domicilio;
    this.pedidosVenta = pedidosVenta;
  }

  static fromJson(json: any): Empleado | null {
    if (!json) return null;

    return new Empleado(
      json.nombre,
      json.apellido,
      json.telefono,
      json.email,
      Usuario.fromJson(json.usuario),
      SucursalEmpresa.fromJson(json.sucursal),
      Domicilio.fromJson(json.domicilio),
      (json.pedidosVenta || []).map((pv: any) => PedidoVenta.fromJson(pv)),
      json.rol
    );
  }

}
