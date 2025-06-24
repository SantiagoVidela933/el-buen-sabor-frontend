import { BaseEntity } from "./BaseEntity";
import { ArticuloManufacturado } from "./ArticuloManufacturado";
import { ArticuloInsumo } from "./ArticuloInsumo";
import { Promocion } from "./Promocion";

export class ImagenPromocion extends BaseEntity {
  nombre: string;
  articuloManufacturado?: ArticuloManufacturado | null;
  articuloInsumo?: ArticuloInsumo | null;
  promocion?: Promocion | null;

  constructor(
    nombre: string,
    articuloManufacturado?: ArticuloManufacturado | null,
    articuloInsumo?: ArticuloInsumo | null,
    promocion?: Promocion | null
  ) {
    super();
    this.nombre = nombre;
    this.articuloManufacturado = articuloManufacturado ?? null;
    this.articuloInsumo = articuloInsumo ?? null;
    this.promocion = promocion ?? null;
  }

  static fromJson(json: any): ImagenPromocion {
    return new ImagenPromocion(
      json.nombre,
      null,
      null,
      null
    );
  }
}
