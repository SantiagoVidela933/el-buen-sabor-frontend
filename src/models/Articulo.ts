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
  tipoArticulo: string; 

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
    tipoArticulo: string = ''
  ) {
    super(id, fechaAlta, fechaModificacion, fechaBaja);
    this.denominacion = denominacion;
    this.unidadMedida = unidadMedida;
    this.sucursal = sucursal;
    this.imagenes = imagenes;
    this.categoria = categoria;
    this.margenGanancia = margenGanancia;
    this.precioVenta = precioVenta;
    this.tipoArticulo = tipoArticulo;
  }

   static fromJson(json: any): Articulo {
    // Para los objetos anidados llamamos sus fromJson respectivos
    const unidadMedida = UnidadMedida.fromJson(json.unidadMedida);
    const sucursal = SucursalEmpresa.fromJson(json.sucursal);
    const imagenes = (json.imagenes ?? []).map((img: any) => Imagen.fromJson(img));
    const categoria = CategoriaArticulo.fromJson(json.categoria);

    // Como es abstracta, instanciamos con 'new' pero en la práctica se usaría una subclase concreta.
    // Para esta demo, asumimos la misma clase (podrías crear una subclase ArticuloConcreto)
    return new (this as any)(
      json.denominacion,
      unidadMedida,
      sucursal,
      imagenes,
      categoria,
      json.margenGanancia,
      json.precioVenta,
      json.id,
      json.fechaAlta,
      json.fechaModificacion,
      json.fechaBaja,
      json.tipoArticulo
    );
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
