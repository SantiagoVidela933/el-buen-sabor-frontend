import { useState, useEffect } from 'react';
import styles from './Facturacion.module.css';
import { getPedidosVentas } from '../../../api/pedidoVenta';
import { PedidoVenta } from '../../../models/PedidoVenta';
import { Estado } from '../../../models/enums/Estado';
import { descargarFacturaPDF, descargarNotaCreditoPDF, anularFactura } from '../../../api/factura';
import Modal from '../../ui/Modal/Modal';
import UserOrderDetail from '../../User/UserOrdetDetail/UserOrderDetail';

const Facturacion = () => {
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);
  const [estadoFiltro, setEstadoFiltro] = useState<string>('Todos');
  const [busquedaId, setBusquedaId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPedido, setSelectedPedido] = useState<PedidoVenta | null>(null);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        setLoading(true);
        const data = await getPedidosVentas();
        setPedidos(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los pedidos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarPedidos();
  }, []);

  const filtrarPedidos = (): PedidoVenta[] => {
    return pedidos.filter(pedido => {
      const coincideEstado = estadoFiltro === 'Todos' || pedido.estado === estadoFiltro;
      const coincideId = busquedaId === '' || pedido.id.toString().includes(busquedaId);
      return coincideEstado && coincideId;
    });
  };

  const pedidosFiltrados = filtrarPedidos();

  // Función para formatear la fecha y hora
  const formatearFechaHora = (fecha: string | Date) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleString('es-AR');
  };

  // Función para ver detalle del pedido
  const handleVerDetalle = (pedido: PedidoVenta) => {
    setSelectedPedido(pedido);
    setShowModal(true);
  };

  // Función para descargar la factura en PDF
  const handleDescargarFactura = async (pedido: PedidoVenta) => {
    if (!pedido.facturas || pedido.facturas.length === 0) {
      alert('Este pedido no tiene factura asociada.');
      return;
    }

    try {
      setActionLoading(true);
      // Obtenemos el ID de la última factura
      const facturaId = pedido.facturas[pedido.facturas.length - 1].id;
      await descargarFacturaPDF(facturaId, `factura-${facturaId}.pdf`);
    } catch (error) {
      alert("Error al descargar la factura. Por favor, intente nuevamente.");
      console.error("Error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Función para descargar nota de crédito
  const handleDescargarNotaCredito = async (pedido: PedidoVenta) => {
    if (!pedido.facturas || pedido.facturas.length === 0) {
      alert('Este pedido no tiene factura asociada para generar nota de crédito.');
      return;
    }

    try {
      setActionLoading(true);
      // Obtenemos el ID de la última factura
      const facturaId = pedido.facturas[pedido.facturas.length - 1].id;
      await descargarNotaCreditoPDF(facturaId, `nota-credito-${facturaId}.pdf`);
    } catch (error) {
      alert("Error al descargar la nota de crédito. Por favor, intente nuevamente.");
      console.error("Error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Función para anular factura
  const handleAnularFactura = async (pedido: PedidoVenta) => {
    if (!pedido.facturas || pedido.facturas.length === 0) {
      alert('Este pedido no tiene factura asociada para anular.');
      return;
    }

    // Confirmar antes de anular
    if (!confirm('¿Está seguro que desea anular esta factura? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setActionLoading(true);
      // Obtenemos el ID de la última factura
      const facturaId = pedido.facturas[pedido.facturas.length - 1].id;
      await anularFactura(facturaId);
      
      // Actualizar la lista de pedidos después de anular
      const data = await getPedidosVentas();
      setPedidos(data);
      
      alert('Factura anulada correctamente.');
    } catch (error) {
      alert("Error al anular la factura. Por favor, intente nuevamente.");
      console.error("Error:", error);
    } finally {
      setActionLoading(false);
    }
  };
  
  if (loading) {
    return <div className={styles.loading}>Cargando pedidos...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

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

      <div className={styles.filters}>
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className={styles.select}
        >
          <option value="Todos">Todos</option>
          <option value={Estado.PENDIENTE}>Pendiente</option>
          <option value={Estado.PREPARACION}>En Preparación</option>
          <option value={Estado.EN_DELIVERY}>En Delivery</option>
          <option value={Estado.ENTREGADO}>Entregado</option>
          <option value={Estado.CANCELADO}>Cancelado</option>
        </select>

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

      {pedidosFiltrados.length === 0 ? (
        <p className={styles.noPedidos}>No hay pedidos que coincidan con los filtros</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>NroPedido</th>
              <th>Fecha/Hora</th>
              <th>Forma de Entrega</th>
              <th>Forma de Pago</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Detalle</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{formatearFechaHora(pedido.fechaPedido)}</td>
                <td>{pedido.tipoEnvio}</td>
                <td>{pedido.formaPago}</td>
                <td>${pedido.totalVenta?.toFixed(2) || pedido.totalVenta?.toFixed(2)}</td>
                <td>{pedido.estado}</td>
                <td>
                  <button 
                    className={styles.detailBtn}
                    onClick={() => handleVerDetalle(pedido)}
                  >
                    Ver Detalle
                  </button>
                </td>
                <td>
                  {pedido.facturas && pedido.facturas.length > 0 && (
                    <>
                      {pedido.estado === Estado.CANCELADO ? (
                        <button 
                          className={styles.actionBtn}
                          onClick={() => handleDescargarNotaCredito(pedido)}
                          disabled={actionLoading}
                        >
                          Nota de Crédito
                        </button>
                      ) : pedido.estado === Estado.ENTREGADO && (
                        <>
                          <button 
                            className={styles.actionBtn}
                            onClick={() => handleDescargarFactura(pedido)}
                            disabled={actionLoading}
                          >
                            Ver Factura
                          </button>
                          <button 
                            className={styles.cancelBtn}
                            onClick={() => handleAnularFactura(pedido)}
                            disabled={actionLoading}
                          >
                            Anular
                          </button>
                        </>
                      )}
                    </>
                  )}  
                  {pedido.estado != Estado.CANCELADO && pedido.estado != Estado.ENTREGADO?(
                        <span className={styles.disabledAction}>Factura Pendiente</span>
                      ):null
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && selectedPedido && (
        <Modal onClose={() => setShowModal(false)}>
          <UserOrderDetail 
            pedidoVenta={selectedPedido}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Facturacion;