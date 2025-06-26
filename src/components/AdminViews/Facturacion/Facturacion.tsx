import { useState, useEffect, useRef } from 'react';
import styles from './Facturacion.module.css';
import { getPedidosVentas } from '../../../api/pedidoVenta';
import { PedidoVenta } from '../../../models/PedidoVenta';
import { Estado } from '../../../models/enums/Estado';
import { descargarFacturaPDF, descargarNotaCreditoPDF, anularFactura } from '../../../api/factura';
import { formatearFechaHora } from '../../../api/formatearFechaHora';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Nuevo estado para controlar la visibilidad del dropdown de estados
  const [showEstadoDropdown, setShowEstadoDropdown] = useState<boolean>(false);
  // Ref para detectar clics fuera del dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8); // Puedes ajustar esto si lo deseas

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

  // useEffect para cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowEstadoDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const filtrarPedidos = (): PedidoVenta[] => {
    const pedidosFiltrados = pedidos.filter(pedido => {
      const coincideEstado = estadoFiltro === 'Todos' || pedido.estado === estadoFiltro;
      const coincideId = busquedaId === '' || (pedido.id?.toString()||'').includes(busquedaId);
      return coincideEstado && coincideId;
    });
    return pedidosFiltrados.sort((a, b) =>{
      if (a.id === undefined) return 1;
      if (b.id === undefined) return -1;
      
      return b.id - a.id;

    });
  };

  const pedidosFiltrados = filtrarPedidos();

  // Calculamos las propiedades para la paginación
  const totalPages = Math.ceil(pedidosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPedidos = pedidosFiltrados.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generar los botones de números de página
  const getPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.paginationButton} ${
            currentPage === i ? styles.activePage : ""
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  // Función para ver detalle del pedido
  const handleVerDetalle = (pedido: PedidoVenta) => {
    setSelectedPedido(pedido);
    setShowModal(true);
  };

  // Función para manejar el cambio de estado desde el dropdown personalizado
  const handleEstadoChange = (estado: string) => {
    setEstadoFiltro(estado);
    setShowEstadoDropdown(false); // Cerrar dropdown después de seleccionar
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
      const ultimaFactura = pedido.facturas[pedido.facturas.length - 1];
      if (!ultimaFactura || ultimaFactura.id === undefined) {
        throw new Error('ID de factura no disponible');
      }
      const facturaId = ultimaFactura.id;
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
    const ultimaFactura = pedido.facturas[pedido.facturas.length - 1];
      if (!ultimaFactura || ultimaFactura.id === undefined) {
        throw new Error('ID de factura no disponible');
      }
      const facturaId = ultimaFactura.id;
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

    if (!confirm('¿Está seguro que desea anular esta factura? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setActionLoading(true);
      // Obtenemos el ID de la última factura
      const ultimaFactura = pedido.facturas[pedido.facturas.length - 1];
      if (!ultimaFactura || ultimaFactura.id === undefined) {
        throw new Error('ID de factura no disponible');
      }
      const facturaId = ultimaFactura.id;
      await anularFactura(facturaId);
      
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
      <div className={styles.header}>
        <div className={styles.titleAndFiltersGroup}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>GESTIÓN DE PEDIDOS</h2>
          </div>

          <div className={styles.estadoFilter} ref={dropdownRef}>
            <button
              className={styles.estadoButton}
              onClick={() => setShowEstadoDropdown(!showEstadoDropdown)}
            >
              {estadoFiltro === 'Todos' ? 'Estado' : estadoFiltro}
              <span className="material-symbols-outlined">
                {showEstadoDropdown ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
            </button>
            {showEstadoDropdown && (
              <div className={styles.estadoDropdown}>
                <div 
                  className={styles.estadoOption} 
                  onClick={() => handleEstadoChange(Estado.PENDIENTE)}
                >
                  Pendiente
                </div>
                <div 
                  className={styles.estadoOption} 
                  onClick={() => handleEstadoChange(Estado.PREPARACION)}
                >
                  En Preparación
                </div>
                <div 
                  className={styles.estadoOption} 
                  onClick={() => handleEstadoChange(Estado.EN_DELIVERY)}
                >
                  En Delivery
                </div>
                <div 
                  className={styles.estadoOption} 
                  onClick={() => handleEstadoChange(Estado.ENTREGADO)}
                >
                  Entregado
                </div>
                <div 
                  className={styles.estadoOption} 
                  onClick={() => handleEstadoChange(Estado.CANCELADO)}
                >
                  Cancelado
                </div>
                <div 
                  className={styles.estadoOption} 
                  onClick={() => handleEstadoChange('Todos')}
                >
                  Todos
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.searchBar}>
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Buscar por Nro. de Pedido..."
            value={busquedaId}
            onChange={(e) => setBusquedaId(e.target.value)}
          />
        </div>
      </div>

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
            {currentPedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{formatearFechaHora(pedido)}</td>
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
                            onClick={() => handleDescargarNotaCredito(pedido)}
                            disabled={actionLoading}
                          >
                            Nota de Crédito
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

      {/* Controles de paginación - agregar después de la tabla */}
      {pedidosFiltrados.length > 0 && totalPages > 1 && (
        <div className={styles.pagination}>
          {getPaginationButtons()}
        </div>
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