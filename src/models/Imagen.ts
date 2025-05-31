import { BaseEntity } from "./BaseEntity";
import { ArticuloManufacturado } from "./ArticuloManufacturado";
import { ArticuloInsumo } from "./ArticuloInsumo";
import { Promocion } from "./Promocion";

export class Imagen extends BaseEntity {
  denominacion: string;
  articuloManufacturado?: ArticuloManufacturado | null;
  articuloInsumo?: ArticuloInsumo | null;
  promocion?: Promocion | null;

  constructor(
    denominacion: string,
    articuloManufacturado?: ArticuloManufacturado | null,
    articuloInsumo?: ArticuloInsumo | null,
    promocion?: Promocion | null
  ) {
    super();
    this.denominacion = denominacion;
    this.articuloManufacturado = articuloManufacturado ?? null;
    this.articuloInsumo = articuloInsumo ?? null;
    this.promocion = promocion ?? null;
  }

  static fromJson(json: any): Imagen {
    return new Imagen(
      json.denominacion,
      null,
      null,
      null
    );
  }
}
