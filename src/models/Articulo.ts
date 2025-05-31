import { BaseEntity } from './BaseEntity';
import { UnidadMedida } from './UnidadMedida';
import { SucursalEmpresa } from './SucursalEmpresa';
import { Imagen } from './Imagen';
import { CategoriaArticulo } from './CategoriaArticulo';

export abstract class Articulo extends BaseEntity {
  denominacion: string;
  precioVenta?: number;
  margenGanancia?: number;
  unidadMedida: UnidadMedida;
  sucursal: SucursalEmpresa;
  imagenes: Imagen[];
  categoria: CategoriaArticulo;

  constructor(
    denominacion: string,
    unidadMedida: UnidadMedida,
    sucursal: SucursalEmpresa,
    imagenes: Imagen[],
    categoria: CategoriaArticulo,
    margenGanancia?: number,
    precioVenta?: number,
    id: number = 0,
    fechaAlta: string | null = null,
    fechaModificacion: string | null = null,
    fechaBaja: string | null = null,
  ) {
    super(id, fechaAlta, fechaModificacion, fechaBaja);
    this.denominacion = denominacion;
    this.unidadMedida = unidadMedida;
    this.sucursal = sucursal;
    this.imagenes = imagenes;
    this.categoria = categoria;
    this.margenGanancia = margenGanancia;
    this.precioVenta = precioVenta;
  }

  protected abstract obtenerCostoBase(): number;

  precioCalculado(): void {
    const costo = this.obtenerCostoBase();
    if (costo == null || this.margenGanancia == null) {
      throw new Error('No se puede calcular precio: falta costo o margen');
    }
    this.precioVenta = costo * (1 + this.margenGanancia / 100);
  }
}
