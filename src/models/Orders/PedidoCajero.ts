export class Pedido {
    pedido: number;
    fecha: string;
    formaDeEntrega: string;
    formaDePago: string;
    pagado: string;
    estado: 'A confirmar' | 'En cocina' | 'En delivery' | 'Listo';
  
    constructor(
      pedido: number,
      fecha: string,
      formaDeEntrega: string,
      formaDePago: string,
      pagado: string,
      estado: 'A confirmar' | 'En cocina' | 'En delivery' | 'Listo'
    ) {
      this.pedido = pedido;
      this.fecha = fecha;
      this.formaDeEntrega = formaDeEntrega;
      this.formaDePago = formaDePago;
      this.pagado = pagado;
      this.estado = estado;
    }
}
