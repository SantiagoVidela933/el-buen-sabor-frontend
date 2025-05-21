import { PedidoProducto } from './PedidoProducto';

export class PedidoCocinero {
  pedido: number;
  fecha: string;
  tiempoDePreparacion: string;
  horaEstimada: string;
  productos: PedidoProducto[];

  constructor(
    pedido: number,
    fecha: string,
    tiempoDePreparacion: string,
    horaEstimada: string,
    productos: PedidoProducto[],
  ) {
    this.pedido = pedido;
    this.fecha = fecha;
    this.tiempoDePreparacion = tiempoDePreparacion;
    this.horaEstimada = horaEstimada;
    this.productos = productos;
  }
}
