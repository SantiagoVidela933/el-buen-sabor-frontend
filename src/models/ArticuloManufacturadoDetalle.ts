import { ArticuloInsumo } from "./ArticuloInsumo";
import { ArticuloManufacturado } from "./ArticuloManufacturado";
import { BaseEntity } from "./BaseEntity";

export class ArticuloManufacturadoDetalle extends BaseEntity {
  cantidad: number;
  articuloInsumo: ArticuloInsumo;
  articuloManufacturado: ArticuloManufacturado | null;

  constructor(
    cantidad: number,
    articuloInsumo: ArticuloInsumo,
    articuloManufacturado: ArticuloManufacturado | null = null
  ) {
    super();
    this.cantidad = cantidad;
    this.articuloInsumo = articuloInsumo;
    this.articuloManufacturado = articuloManufacturado;
  }

  static fromJson(json: any): ArticuloManufacturadoDetalle {
    return new ArticuloManufacturadoDetalle(
      json.cantidad,
      ArticuloInsumo.fromJson(json.articuloInsumo),
      null
    );
  }
}

