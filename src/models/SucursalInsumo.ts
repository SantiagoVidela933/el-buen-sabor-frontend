// models/SucursalInsumo.ts
import { BaseEntity } from './BaseEntity';
import { ArticuloInsumo } from './ArticuloInsumo';
import { SucursalEmpresa } from './SucursalEmpresa';

export class SucursalInsumo extends BaseEntity {
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  articuloInsumo: ArticuloInsumo;
  sucursal: SucursalEmpresa;

  constructor(
    stockActual: number,
    stockMinimo: number,
    stockMaximo: number,
    articuloInsumo: ArticuloInsumo,
    sucursal: SucursalEmpresa
  ) {
    super();
    this.stockActual = stockActual;
    this.stockMinimo = stockMinimo;
    this.stockMaximo = stockMaximo;
    this.articuloInsumo = articuloInsumo;
    this.sucursal = sucursal;
  }
}
