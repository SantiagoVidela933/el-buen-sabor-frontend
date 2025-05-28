// models/SucursalEmpresa.ts
import { Empresa } from './Empresa';
import { Empleado } from './Empleado';
import { Domicilio } from './Domicilio';
import { Factura } from './Factura';
import { PedidoVenta } from './PedidoVenta';
import { Promocion } from './Promocion';
import { Articulo } from './Articulo';
import { SucursalInsumo } from './SucursalInsumo';
import { CategoriaArticulo } from './CategoriaArticulo';

export class SucursalEmpresa {
  id?: number;
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
}
