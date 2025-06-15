import { useState, useEffect } from 'react';
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
    // Si el cliente ya está seleccionado, deseleccionarlo
    if (clienteSeleccionado === clienteId) {
      setClienteSeleccionado(null);
    } else {
      setClienteSeleccionado(clienteId);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, [fechaInicio, fechaFin, orden]);
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Ranking de clientes</h2>

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
            {tablaClientes.map((cliente: any) => (
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
                      <ClientStatsDetails clienteId={cliente.clienteId} />
                    </td>
                  </tr>
                )}
              </>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientStats
