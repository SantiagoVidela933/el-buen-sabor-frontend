import { PedidoVenta } from '../models/PedidoVenta';

// Función para formatear la fecha y hora de un pedido
export const formatearFechaHora = (pedido: PedidoVenta) => {
  if (!pedido.fechaPedido) return 'N/A';
  
  try {
    // Asegurarse de que la fecha sea una cadena
    const fechaString = typeof pedido.fechaPedido === 'string' 
      ? pedido.fechaPedido 
      : pedido.fechaPedido.toISOString();
    
    // Si existe horaPedido, usamos esa información
    if (pedido.horaPedido) {
      // Crear fecha sin timezone (como fecha local)
      const [year, month, day] = fechaString.split('T')[0].split('-').map(Number);
      
      // Corregir el mes (0-indexed en JavaScript)
      const fechaCorrecta = new Date(year, month - 1, day);
      
      const dia = fechaCorrecta.getDate().toString().padStart(2, '0');
      const mes = (fechaCorrecta.getMonth() + 1).toString().padStart(2, '0');
      const anio = fechaCorrecta.getFullYear();
      
      // Devolvemos la fecha formateada con la hora del pedido
      return `${dia}/${mes}/${anio} ${pedido.horaPedido}`;
    }
    
    // Si no hay horaPedido, formateamos la fecha completa
    // Extraer directamente las partes de la fecha para evitar problemas de timezone
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