// models/ArticuloManufacturadoDetalle.ts
import { BaseEntity } from './BaseEntity';
import { ArticuloInsumo } from './ArticuloInsumo';
import { ArticuloManufacturado } from './ArticuloManufacturado';

export class ArticuloManufacturadoDetalle extends BaseEntity {
  cantidad: number;
  articuloInsumo: ArticuloInsumo;
  articuloManufacturado: ArticuloManufacturado;

  constructor(
    cantidad: number,
    articuloInsumo: ArticuloInsumo,
    articuloManufacturado: ArticuloManufacturado
  ) {
    super();
    this.cantidad = cantidad;
    this.articuloInsumo = articuloInsumo;
    this.articuloManufacturado = articuloManufacturado;
  }
}
