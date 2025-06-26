import { Empresa } from './Empresa';
import { Empleado } from './Empleado';
import { Domicilio } from './Domicilio';
import { Factura } from './Factura';
import { PedidoVenta } from './PedidoVenta';
import { Promocion } from './Promocion';
import { Articulo } from './Articulo';
import { SucursalInsumo } from './SucursalInsumo';
import { CategoriaArticulo } from './CategoriaArticulo';
import { BaseEntity } from './BaseEntity';

export class SucursalEmpresa extends BaseEntity {
  nombre: string;
  horaApertura: string;
  horaCierre: string;
  empresa: Empresa;
  empleados: Empleado[];
  domicilio: Domicilio;
  facturas: Factura[];
  pedidosVenta: PedidoVenta[];
  promociones: Promocion[];
  articulos: Articulo[];
  sucursalInsumos: SucursalInsumo[];
  categoriasArticulo: CategoriaArticulo[];

  constructor(
    id: number,
    fechaAlta: string | null = null,
    fechaModificacion: string | null = null,
    fechaBaja: string | null = null,
    nombre: string,
    horaApertura: string,
    horaCierre: string,
    empresa: Empresa,
    domicilio: Domicilio,
    empleados: Empleado[] = [],
    facturas: Factura[] = [],
    pedidosVenta: PedidoVenta[] = [],
    promociones: Promocion[] = [],
    articulos: Articulo[] = [],
    sucursalInsumos: SucursalInsumo[] = [],
    categoriasArticulo: CategoriaArticulo[] = []
  ) {
    super(id, fechaAlta, fechaModificacion, fechaBaja);
    this.nombre = nombre;
    this.horaApertura = horaApertura;
    this.horaCierre = horaCierre;
    this.empresa = empresa;
    this.domicilio = domicilio;
    this.empleados = empleados;
    this.facturas = facturas;
    this.pedidosVenta = pedidosVenta;
    this.promociones = promociones;
    this.articulos = articulos;
    this.sucursalInsumos = sucursalInsumos;
    this.categoriasArticulo = categoriasArticulo;
  }

  static fromJson(json: any): SucursalEmpresa {
    if (!json) {
      return new SucursalEmpresa(
        0,
        null,
        null,
        null,
        '',
        '',
        '',
        {} as Empresa,
        {} as Domicilio,
        [],
        [],
        [],
        [],
        [],
        [],
        []
      );
    }

    return new SucursalEmpresa(
      json.id ?? 0,
      json.fechaAlta ?? null,
      json.fechaModificacion ?? null,
      json.fechaBaja ?? null,
      json.nombre,
      json.horaApertura,
      json.horaCierre,
      json.empresa,
      json.domicilio,
      [],
      [],
      [],
      [],
      [],
      [],
      []
    );
  }
}
