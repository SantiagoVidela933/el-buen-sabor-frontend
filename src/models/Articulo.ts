// models/Articulo.ts
import { UnidadMedida } from './UnidadMedida';
import { SucursalEmpresa } from './SucursalEmpresa';
import { Imagen } from './Imagen';
import { CategoriaArticulo } from './CategoriaArticulo';

export abstract class Articulo {
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
    precioVenta?: number
  ) {
    this.denominacion = denominacion;
    this.unidadMedida = unidadMedida;
    this.sucursal = sucursal;
    this.imagenes = imagenes;
    this.categoria = categoria;
    this.margenGanancia = margenGanancia;
    this.precioVenta = precioVenta;
  }

  // método abstracto que deben implementar las subclases
  protected abstract obtenerCostoBase(): number;

  precioCalculado(): void {
    const costo = this.obtenerCostoBase();
    if (costo == null || this.margenGanancia == null) {
      throw new Error('No se puede calcular precio: falta costo o margen');
    }
    this.precioVenta = costo * (1 + this.margenGanancia / 100);
  }
}
