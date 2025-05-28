import { BaseEntity } from "./BaseEntity";
import { SucursalEmpresa } from "./SucursalEmpresa";

export class Empresa extends BaseEntity {
  nombre: string;
  razonSocial: string;
  cuil: number;
  sucursales: SucursalEmpresa[];

  constructor(
    nombre: string,
    razonSocial: string,
    cuil: number,
    sucursales: SucursalEmpresa[] = []
  ) {
    super();
    this.nombre = nombre;
    this.razonSocial = razonSocial;
    this.cuil = cuil;
    this.sucursales = sucursales;
  }
}
