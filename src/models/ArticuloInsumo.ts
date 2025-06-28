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
    id: number = 0,
    fechaAlta: string | null = null,
    fechaModificacion: string | null = null,
    fechaBaja: string | null = null,
  ) {
    super(
      denominacion,
      unidadMedida,
      sucursal,
      imagenes,
      categoria,
      margenGanancia,
      undefined,
      id,                 
      fechaAlta,
      fechaModificacion,
      fechaBaja
    );
    this.precioCompra = precioCompra;
    this.esParaElaborar = esParaElaborar;
    this.stockPorSucursal = stockPorSucursal;
    this.precioCalculado();
  }

  static fromJson(json: any): ArticuloInsumo {
    return new ArticuloInsumo(
      json.denominacion,
      json.precioCompra ?? 0, 
      json.esParaElaborar ?? false,
      UnidadMedida.fromJson(json.unidadMedida),
      SucursalEmpresa.fromJson(json.sucursal || {}),
      (json.imagenes || []).map((img: any) => Imagen.fromJson(img)),
      CategoriaArticulo.fromJson(json.categoria || {}),
      json.stockPorSucursal || [],
      json.margenGanancia ?? 0, 
      json.id,
      json.fechaAlta,
      json.fechaModificacion,
      json.fechaBaja
    );
  }

  protected override obtenerCostoBase(): number {
    return this.precioCompra;
  }
}
