import { PedidoVenta } from '../models/PedidoVenta';

// Formatear la fecha y hora de un pedido
export const formatearFechaHora = (pedido: PedidoVenta) => {
  if (!pedido.fechaPedido) return 'N/A';
  try {
    const fechaString = typeof pedido.fechaPedido === 'string' 
      ? pedido.fechaPedido 
      : pedido.fechaPedido.toISOString();
    
    if (pedido.horaPedido) {
      const [year, month, day] = fechaString.split('T')[0].split('-').map(Number);
      
      const fechaCorrecta = new Date(year, month - 1, day);
      
      const dia = fechaCorrecta.getDate().toString().padStart(2, '0');
      const mes = (fechaCorrecta.getMonth() + 1).toString().padStart(2, '0');
      const anio = fechaCorrecta.getFullYear();
      
      return `${dia}/${mes}/${anio} ${pedido.horaPedido}`;
    }
    
    // Si no hay horaPedido, formateamos la fecha completa
    const [fecha] = fechaString.split('T');
    const [anio, mes, dia] = fecha.split('-');
    
    // Si hay una parte de tiempo en la fecha
    let hora = '00';
    let minutos = '00';
    
    if (fechaString.includes('T')) {
      const [, tiempo] = fechaString.split('T');
      [hora, minutos] = tiempo.split(':');
    }
    
    return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    console.error('Fecha problemática:', pedido.fechaPedido);
    return 'Error en fecha';
  }
};