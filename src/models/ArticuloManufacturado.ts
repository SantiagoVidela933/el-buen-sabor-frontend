// models/ArticuloManufacturado.ts
import { Articulo } from './Articulo';
import { ArticuloManufacturadoDetalle } from './ArticuloManufacturadoDetalle';
import { SucursalEmpresa } from './SucursalEmpresa';
import { UnidadMedida } from './UnidadMedida';
import { Imagen } from './Imagen';
import { CategoriaArticulo } from './CategoriaArticulo';

export class ArticuloManufacturado extends Articulo {
  tiempoEstimadoMinutos: number;
  descripcion: string;
  precioCosto: number;
  detalles: ArticuloManufacturadoDetalle[];
  estado: boolean;
  
  constructor(
    denominacion: string,
    unidadMedida: UnidadMedida,
    sucursal: SucursalEmpresa,
    imagenes: Imagen[],
    categoria: CategoriaArticulo,
    margenGanancia: number = 0,
    precioVenta: number,
    id: number = 0,
    fechaAlta: string | null = null,
    fechaModificacion: string | null = null,
    fechaBaja: string | null = null,
    tiempoEstimadoMinutos: number = 0,
    descripcion: string = '',
    detalles: ArticuloManufacturadoDetalle[] = [],
    estado: boolean = true
  ) {
    super(
      denominacion,
      unidadMedida,
      sucursal,
      imagenes,
      categoria,
      margenGanancia,
      precioVenta,
      id,
      fechaAlta,
      fechaModificacion,
      fechaBaja,
    );
    this.tiempoEstimadoMinutos = tiempoEstimadoMinutos;
    this.descripcion = descripcion;
    this.detalles = detalles;
    this.precioCosto = 0;
    this.estado = estado;
  }

  static fromJson(json: any): ArticuloManufacturado {
  return new ArticuloManufacturado(
    json.denominacion,
    new UnidadMedida(json.unidadMedida?.denominacion || ''),
    {} as any, 
    json.imagenes || [],
    CategoriaArticulo.fromJson(json.categoria),
    json.margenGanancia ?? 0,
    json.precioVenta ?? 0,
    json.id ?? 0,
    json.fechaAlta ?? null,
    json.fechaModificacion ?? null,
    json.fechaBaja ?? null,
    json.tiempoEstimadoMinutos ?? 0,
    json.descripcion ?? '',
    (json.detalles || []).map((detalle: any) =>
      new ArticuloManufacturadoDetalle(
        detalle.id,
        detalle.cantidad,
        detalle.articuloInsumo ? {
          id: detalle.articuloInsumo.id,
          precioCompra: detalle.articuloInsumo.precioCompra,
          stockPorSucursal: detalle.articuloInsumo.stockPorSucursal,
          } as any : {} as any,
          {} as any 
        )
      ),
      json.estado ?? true
    );
  }
  
  protected override obtenerCostoBase(): number {
    return this.precioCosto;
  }

  costoCalculado(): void {
    if (!this.detalles || this.detalles.length === 0) {
      this.precioCosto = 0;
      return;
    }

    let total = 0;
    for (const detalle of this.detalles) {
      const insumo = detalle.articuloInsumo;
      if (
        insumo &&
        insumo.precioCompra != null &&
        detalle.cantidad != null
      ) {
        total += insumo.precioCompra * detalle.cantidad;
      }
    }
    this.precioCosto = total;
  }

  stockCalculado(): number {
    if (!this.sucursal || !this.detalles || this.detalles.length === 0) {
      return 0;
    }

    let stockMaxFabricable = Number.MAX_SAFE_INTEGER;

    for (const detalle of this.detalles) {
      const insumo = detalle.articuloInsumo;
      if (!insumo || detalle.cantidad == null || detalle.cantidad <= 0) {
        return 0;
      }

      const stockSucursalInsumo = insumo.stockPorSucursal.find(
        (stock) => stock.sucursal?.id === this.sucursal.id
      );

      if (!stockSucursalInsumo || stockSucursalInsumo.stockActual == null) {
        return 0;
      }

      const unidadesPosibles = Math.floor(
        stockSucursalInsumo.stockActual / detalle.cantidad
      );

      if (unidadesPosibles < stockMaxFabricable) {
        stockMaxFabricable = unidadesPosibles;
      }
    }

    return stockMaxFabricable;
  }
}
