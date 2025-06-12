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

  static fromJson(json: any): Localidad | null {
    if (!json) return null;

    const domicilios = (json.domicilios || []).map((d: any) => Domicilio.fromJson(d));
    const provincia = json.provincia ? Provincia.fromJson(json.provincia) : null;

    return new Localidad(
      json.nombre,
      domicilios,
      provincia
    );
  }
}
