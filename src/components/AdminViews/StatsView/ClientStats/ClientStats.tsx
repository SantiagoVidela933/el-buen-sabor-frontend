import {useState, useEffect } from 'react';
import React from 'react';
import styles from './ClientStats.module.css';
import Chart from 'react-google-charts';
import ClientStatsDetails from './ClientStatsDetail/ClientStatsDetail';
import { fetchRankingClientes, downloadRankingClientesExcel } from '../../../../api/ranking';


const ClientStats = () => {

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [orden, setOrden] = useState('cantidad');
  const [datosClientes, setDatosClientes] = useState([['Cliente', 'Cantidad Comprada']]);
  const [tablaClientes, setTablaClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(null);

  // --- Estados para la paginación ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(2); // Cantidad de clientes por página

  const obtenerDatos = async () => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const desde = fechaInicio || '2000-01-01';
    const hasta = fechaFin || fechaActual;

    try {
      const data = await fetchRankingClientes(desde, hasta, orden);

      const clientesGrafico =
                data.length > 0
                  ? data.map((item: any) => [item.clienteNome, Number(item.cantidadPedidos)])
                  : [['Sin Ventas', 0]];      
      setDatosClientes([['Cliente', 'Cantidad Comprada'], ...clientesGrafico]);
      setTablaClientes(data);
      setCurrentPage(1); // Resetear a la primera página cuando cambian los datos
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const exportarExcel = async () => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const desde = fechaInicio || '2000-01-01';
    const hasta = fechaFin || fechaActual;

    try {
      await downloadRankingClientesExcel(desde, hasta, orden);
      alert('Archivo descargado con éxito.');
    } catch (error) {
      alert('Error al descargar el archivo Excel.');
    }
  };
  
  const toggleDetalles = (clienteId: number) => {
    if (clienteSeleccionado === clienteId) {
      setClienteSeleccionado(null);
    } else {
      setClienteSeleccionado(clienteId);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, [fechaInicio, fechaFin, orden]);

  // --- Lógica de Paginación ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = tablaClientes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tablaClientes.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <div className={styles.container}>
      {/* SECCIÓN DEL TÍTULO MODIFICADA */}
      <div className={styles.titleBox}>
        <h2 className={styles.title}>Ranking de clientes</h2>
      </div>

      <div className={styles.filtros}>
        <label>
          Desde:
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </label>
        <label>
          Hasta:
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </label>

        <label>
          Ordenar por:
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as 'cantidad' | 'importe')}
          >
            <option value="cantidad">Cantidad de pedidos</option>
            <option value="importe">Importe total</option>
          </select>
        </label>

        <button className={styles.exportarBtn} onClick={exportarExcel}>
          <span className="material-symbols-outlined">file_download</span>
          Exportar a Excel
        </button>
      </div>

      <Chart
        chartType="BarChart"
        width="100%"
        height="300px"
        data={datosClientes}
        options={{
          legend: { position: 'none' },
          chartArea: { width: '70%' },
          hAxis: {
            title: orden === 'pedidos' ? 'Cantidad de Pedidos' : 'Importe Total',
            minValue: 0,
          },
          sort: false,
        }}
      />

      <div className={styles.tabla}>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Cantidad de pedidos</th>
              <th>Importe total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Usamos currentClients para renderizar los clientes de la página actual */}
            {currentClients.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.emptyMessage}>
                  No hay clientes que cumplan los criterios de búsqueda.
                </td>
              </tr>
            ) : (
              currentClients.map((cliente: any) => (
                <React.Fragment key={cliente.clienteId}>
                <>
                  <tr key={cliente.clienteId}>
                    <td>{cliente.clienteNome}</td>
                    <td>{cliente.cantidadPedidos}</td>
                    <td>${cliente.importeTotal.toFixed(2)}</td>
                    <td>
                      <button
                        className={styles.verPedidosBtn}
                        onClick={() => toggleDetalles(cliente.clienteId)}
                      >
                        {clienteSeleccionado === cliente.clienteId ? 'Ocultar pedidos' : 'Ver pedidos'}
                      </button>
                    </td>
                  </tr>
                  {clienteSeleccionado === cliente.clienteId && (
                    <tr>
                      <td colSpan={4}>
                        <ClientStatsDetails
                          clienteId={cliente.clienteId}
                          fechaInicio={fechaInicio || '2000-01-01'} // Usar directamente la cadena seleccionada
                          fechaFin={fechaFin || new Date().toISOString().split('T')[0]} // Usar directamente la cadena seleccionada
                        />
                      </td>
                    </tr>
                  )}
                </>
                </React.Fragment>      
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Controles de Paginación Numérica --- */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`${styles.paginationButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientStats;