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
}
