import React, { useState } from 'react'; // Aseguramos la importación de React
import styles from './Facturacion.module.css';
import { mockOrders, Order } from './orders'; // Asumo que orders.ts existe y está correctamente tipado

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

  // Contar el número total de columnas en la tabla para el colSpan del mensaje noData
  const numeroColumnasTabla = 9; // Contando todas las <th>: NroPedido, Fecha/Hora, Forma de Entrega, Forma de Pago, Pagado, Estado, Detalle, Acciones (estas 2 ultimas son 2 columnas separadas)

  return (
    <div className={styles.container}>
      <div className={styles.header}> {/* Añadido .header para el layout */}
        <div className={styles.titleGroup}> {/* Añadido .titleGroup para envolver el título */}
          <div className={styles.titleBox}> {/* Añadido .titleBox para el fondo del título */}
            <h2 className={styles.title}>GESTIÓN DE PEDIDOS</h2> {/* Título ajustado y en mayúsculas */}
          </div>
          {/* Filtro por estado - Usando el estilo de dropdown si lo deseas, o select normal */}
          <div className={styles.selectWrapper}> {/* Wrapper para el select si quieres darle un estilo consistente */}
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
          </div>
        </div>

        {/* Filters - Integrados en un contenedor consistente */}
        <div className={styles.searchFilterContainer}> {/* Contenedor para filtros y búsqueda */}

          {/* Barra de búsqueda */}
          <div className={styles.searchBar}> {/* Usamos .searchBar para el input */}
            <span className="material-symbols-outlined">search</span> {/* Icono de búsqueda */}
            <input
              type="text"
              placeholder="Buscar por Nro. de Pedido..."
              value={busquedaId}
              onChange={(e) => setBusquedaId(e.target.value)}
            />
          </div>
        </div>
      </div> {/* Fin de .header */}

      <div className={styles.tableWrapper}> {/* Envuelve la tabla para el overflow-x */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nro. Pedido</th> {/* Ajustado el texto */}
              <th>Fecha/Hora</th>
              <th>Entrega</th> {/* Más conciso */}
              <th>Pago</th> {/* Más conciso */}
              <th>Pagado</th>
              <th>Estado</th>
              <th>Detalle</th>
              <th>Acciones</th> {/* Ambas acciones en una columna */}
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length === 0 ? (
              <tr>
                {/* Usar el número de columnas calculado dinámicamente */}
                <td colSpan={numeroColumnasTabla} className={styles.noData}>
                  No hay pedidos que coincidan con la búsqueda o filtros.
                </td>
              </tr>
            ) : (
              pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td> {/* Añadido # para consistencia */}
                  <td>{pedido.date}</td>
                  <td>{pedido.deliveryMethod}</td>
                  <td>{pedido.paymentMethod}</td>
                  <td>{pedido.paid ? 'Sí' : 'No'}</td>
                  <td>{pedido.status}</td>
                  <td>
                    <button className={styles.detailBtn}>Ver Detalle</button>
                  </td>
                  <td className={styles.actions}> {/* Contenedor para los botones de acción */}
                    <button className={styles.actionBtn}>Ver Factura</button>
                    <button className={styles.cancelBtn}>Anular</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Facturacion;