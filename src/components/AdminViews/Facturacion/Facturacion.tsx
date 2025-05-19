import { useState } from 'react';
import styles from './Facturacion.module.css';
import { mockOrders, Order } from './orders';

const Facturacion = () => {
  const [estadoFiltro, setEstadoFiltro] = useState<string>('Todos');
  const [busquedaId, setBusquedaId] = useState<string>('');

  const filtrarPedidos = (): Order[] => {
    return mockOrders.filter(order => {
      const coincideEstado = estadoFiltro === 'Todos' || order.status === estadoFiltro;
      const coincideId = busquedaId === '' || order.id.toString().includes(busquedaId);
      return coincideEstado && coincideId;
    });
  };

  const pedidosFiltrados = filtrarPedidos();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gestión de Pedidos</h2>

      <div className={styles.filters}>
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className={styles.select}
        >
          <option value="Todos">Todos</option>
          <option value="A confirmar">A confirmar</option>
          <option value="En cocina">En cocina</option>
          <option value="Entregado">Entregado</option>
        </select>

        <input
          type="text"
          placeholder="Buscar por Nro. de Pedido"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          className={styles.input}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>NroPedido</th>
            <th>Fecha/Hora</th>
            <th>Forma de Entrega</th>
            <th>Forma de Pago</th>
            <th>Pagado</th>
            <th>Estado</th>
            <th>Detalle</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.date}</td>
              <td>{pedido.deliveryMethod}</td>
              <td>{pedido.paymentMethod}</td>
              <td>{pedido.paid ? 'Sí' : 'No'}</td>
              <td>{pedido.status}</td>
              <td>
                <button className={styles.detailBtn}>Ver Detalle</button>
              </td>
              <td>
                <button className={styles.actionBtn}>Ver Factura</button>
                <button className={styles.cancelBtn}>Anular</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Facturacion;
