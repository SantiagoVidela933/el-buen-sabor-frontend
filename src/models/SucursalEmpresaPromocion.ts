import { BaseEntity } from './BaseEntity';

export class SucursalEmpresaPromocion extends BaseEntity {
  nombre: string;
  
  constructor(
    id: number,
    nombre: string,
  ) {
    super(id);
    this.nombre = nombre;
  }

  static fromJson(json: any): SucursalEmpresaPromocion {
    if (!json) {
      return new SucursalEmpresaPromocion(
        0,
        '',
      );
    }

    return new SucursalEmpresaPromocion(
      json.id ?? 0,
      json.nombre,
    );
  }
}
