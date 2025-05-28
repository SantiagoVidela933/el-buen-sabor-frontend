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
}
