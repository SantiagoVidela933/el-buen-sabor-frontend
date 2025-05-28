import { BaseEntity } from "./BaseEntity";
import { Domicilio } from "./Domicilio";
import { Provincia } from "./Provincia";

export class Localidad extends BaseEntity {
  nombre: string;
  domicilios: Domicilio[];
  provincia?: Provincia | null;

  constructor(
    nombre: string,
    domicilios: Domicilio[] = [],
    provincia?: Provincia | null
  ) {
    super();
    this.nombre = nombre;
    this.domicilios = domicilios;
    this.provincia = provincia ?? null;
  }
}
