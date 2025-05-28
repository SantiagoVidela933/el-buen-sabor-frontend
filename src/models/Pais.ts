import { BaseEntity } from "./BaseEntity";
import { Provincia } from "./Provincia";

export class Pais extends BaseEntity {
  nombre: string;
  provincias: Provincia[];

  constructor(nombre: string, provincias: Provincia[] = []) {
    super();
    this.nombre = nombre;
    this.provincias = provincias;
  }
}
