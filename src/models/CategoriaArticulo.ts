import { BaseEntity } from "./BaseEntity";
import { Articulo } from "./Articulo";
import { SucursalEmpresa } from "./SucursalEmpresa";

export class CategoriaArticulo extends BaseEntity {
  denominacion: string;
  categoriaPadre?: Partial<CategoriaArticulo> | null;
  articulo: Articulo[];
  sucursal?: Partial<SucursalEmpresa>;

  constructor(
    denominacion: string,
    categoriaPadre?: CategoriaArticulo,
    sucursal?: Partial<SucursalEmpresa>,
    articulo: Articulo[] = []
  ) {
    super();
    this.denominacion = denominacion;
    this.categoriaPadre = categoriaPadre;
    this.sucursal = sucursal;
    this.articulo = articulo;
  }

  static fromJson(json: any): CategoriaArticulo {
    const categoria = new CategoriaArticulo(
      json.denominacion,
      json.categoriaPadre,
      json.sucursal,
      json.articulo || []
    );
    categoria.id = json.id;
    categoria.fechaAlta = json.fechaAlta;
    categoria.fechaModificacion = json.fechaModificacion;
    categoria.fechaBaja = json.fechaBaja;
    return categoria;
  }
}
