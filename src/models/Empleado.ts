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
  password: string; 
  usuario: Usuario;
  sucursal: SucursalEmpresa;
  domicilio: Domicilio;
  pedidosVenta: PedidoVenta[];

  constructor(
    id: number = 0,
    fechaAlta: string | null = null,
    fechaModificacion: string | null = null,
    fechaBaja: string | null = null,
    nombre: string,
    apellido: string,
    telefono: string,
    email: string,
    password: string, 
    usuario: Usuario,
    sucursal: SucursalEmpresa,
    domicilio: Domicilio,
    pedidosVenta: PedidoVenta[] = [],
    rol: Rol
  ) {
    super(id, fechaAlta, fechaModificacion, fechaBaja);
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.email = email;
    this.password = password;
    this.rol = rol;
    this.usuario = usuario;
    this.sucursal = sucursal;
    this.domicilio = domicilio;
    this.pedidosVenta = pedidosVenta;
  }

  static fromJson(json: any): Empleado | null {
    if (!json || json.id == null) return null;

    return new Empleado(
      json.id,
      json.fechaAlta,
      json.fechaModificacion,
      json.fechaBaja,
      json.nombre,
      json.apellido,
      json.telefono,
      json.email,
      json.password, // ✅ Se extrae del JSON
      Usuario.fromJson(json.usuario),
      SucursalEmpresa.fromJson(json.sucursal),
      Domicilio.fromJson(json.domicilio),
      (json.pedidosVenta || []).map((pv: any) => PedidoVenta.fromJson(pv)),
      json.rol
    );
  }
}
