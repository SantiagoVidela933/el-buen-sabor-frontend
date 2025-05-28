// models/ArticuloInsumo.ts
import { Articulo } from './Articulo';
import { UnidadMedida } from './UnidadMedida';
import { SucursalEmpresa } from './SucursalEmpresa';
import { Imagen } from './Imagen';
import { CategoriaArticulo } from './CategoriaArticulo';
import { SucursalInsumo } from './SucursalInsumo';

export class ArticuloInsumo extends Articulo {
  precioCompra: number;
  esParaElaborar: boolean;
  stockPorSucursal: SucursalInsumo[];

  constructor(
    denominacion: string,
    precioCompra: number,
    esParaElaborar: boolean,
    unidadMedida: UnidadMedida,
    sucursal: SucursalEmpresa,
    imagenes: Imagen[],
    categoria: CategoriaArticulo,
    stockPorSucursal: SucursalInsumo[] = [],
    margenGanancia?: number,
  ) {
    super(denominacion, unidadMedida, sucursal, imagenes, categoria, margenGanancia);
    this.precioCompra = precioCompra;
    this.esParaElaborar = esParaElaborar;
    this.stockPorSucursal = stockPorSucursal;

    this.precioCalculado(); // Calcula precioVenta al construir
  }

  static fromJson(json: any): ArticuloInsumo {
    return new ArticuloInsumo(
      json.denominacion,
      json.precioCompra,
      json.esParaElaborar,
      UnidadMedida.fromJson(json.unidadMedida),
      SucursalEmpresa.fromJson(json.sucursal),
      (json.imagenes || []).map((img: any) => Imagen.fromJson(img)),
      CategoriaArticulo.fromJson(json.categoria),
      json.stockPorSucursal || [],
      json.margenGanancia
    );
  }

  protected override obtenerCostoBase(): number {
    return this.precioCompra;
  }

  
}
