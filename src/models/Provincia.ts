import { BaseEntity } from "./BaseEntity";
import { Localidad } from "./Localidad";
import { Pais } from "./Pais";

export class Provincia extends BaseEntity {
  nombre: string;
  localidades?: Localidad[];
  pais?: Pais;

  constructor(
    nombre: string,
    localidades?: Localidad[],
    pais?: Pais
  ) {
    super();
    this.nombre = nombre;
    this.localidades = localidades;
    this.pais = pais;
  }

  static fromJson(json: any): Provincia | null {
    if (!json) return null;

    const localidades = (json.localidades || []).map((l: any) => Localidad.fromJson(l));
    const pais = json.pais ? Pais.fromJson(json.pais) : undefined;

    return new Provincia(
      json.nombre,
      localidades,
      pais
    );
  }

}
