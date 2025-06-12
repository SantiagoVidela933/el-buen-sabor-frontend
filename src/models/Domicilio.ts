import { BaseEntity } from "./BaseEntity";
import { SucursalEmpresa } from "./SucursalEmpresa";
import { Localidad } from "./Localidad";

export class Domicilio extends BaseEntity {
  calle: string;
  numero: number;
  codigoPostal: number;
  sucursal?: SucursalEmpresa; 
  localidad: Localidad;
  idLocalidad:number=0;

  constructor(
    calle: string,
    numero: number,
    codigoPostal: number,
    localidad: Localidad,
    sucursal?: SucursalEmpresa
  ) {
    super();
    this.calle = calle;
    this.numero = numero;
    this.codigoPostal = codigoPostal;
    this.localidad = localidad;
    if (sucursal) this.sucursal = sucursal;
  }

  static fromJson(json: any): Domicilio | null {
  if (!json) return null;

  const localidad = json.localidad ? Localidad.fromJson(json.localidad) : null;
  const sucursal = json.sucursal ? SucursalEmpresa.fromJson(json.sucursal) : undefined;

  return new Domicilio(
    json.calle,
    json.numero,
    json.codigoPostal,
    localidad!,
    sucursal
  );
}
}
