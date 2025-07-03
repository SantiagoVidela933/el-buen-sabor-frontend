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

  static fromJson(json: any): Pais | null {
    if (!json) return null;

    const provincias = (json.provincias || []).map((p: any) => Provincia.fromJson(p));

    return new Pais(
      json.nombre,
      provincias
    );
  }
}
