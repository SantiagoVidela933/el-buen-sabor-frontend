import { BaseEntity } from "./BaseEntity";
import { Articulo } from "./Articulo";
import { SucursalEmpresa } from "./SucursalEmpresa";
import { Imagen } from "./Imagen";

export class CategoriaArticulo extends BaseEntity {
  denominacion: string;
  categoriaPadre?: CategoriaArticulo;
  articulo: Articulo[];
  sucursal?: SucursalEmpresa;
  imagen?: Imagen;

  constructor(
    denominacion: string,
    imagen: Imagen,
    categoriaPadre?: CategoriaArticulo,
    sucursal?: SucursalEmpresa,
    articulo: Articulo[] = []
  ) {
    super();
    this.denominacion = denominacion;
    this.imagen = imagen;
    this.categoriaPadre = categoriaPadre;
    this.sucursal = sucursal;
    this.articulo = articulo;
  }

  static fromJson(json: any): CategoriaArticulo {
    const categoria = new CategoriaArticulo(
      json.denominacion,
      json.imagen ? new Imagen(json.imagen) : {} as Imagen
    );
    categoria.id = json.id;
    categoria.fechaAlta = json.fechaAlta;
    categoria.fechaModificacion = json.fechaModificacion;
    categoria.fechaBaja = json.fechaBaja;
    return categoria;
  }
}
