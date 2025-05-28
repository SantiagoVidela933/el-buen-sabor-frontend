import { BaseEntity } from "./BaseEntity";
import { Articulo } from "./Articulo";
import { SucursalEmpresa } from "./SucursalEmpresa";
import { Imagen } from "./Imagen";

export class CategoriaArticulo extends BaseEntity {
  denominacion: string;
  categoriaPadre?: CategoriaArticulo;
  articulo: Articulo[];
  sucursal?: SucursalEmpresa;
  imagen: Imagen;

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
}
