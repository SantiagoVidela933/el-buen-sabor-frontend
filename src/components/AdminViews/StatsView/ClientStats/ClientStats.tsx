import { useState } from 'react';
import styles from './ClientStats.module.css';
import Chart from 'react-google-charts';

const ClientStats = () => {

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [ordenarPor, setOrdenarPor] = useState<'pedidos' | 'importe'>('pedidos');

  // Datos simulados
  const clientesData = [
    { nombre: 'Juan Pérez', pedidos: 12, importe: 32000 },
    { nombre: 'Lucía González', pedidos: 9, importe: 29000 },
    { nombre: 'Carlos Romero', pedidos: 14, importe: 27500 },
    { nombre: 'María López', pedidos: 7, importe: 21000 },
    { nombre: 'Ana Martínez', pedidos: 10, importe: 30500 },
  ];

  const datosGrafico = [
    ['Cliente', ordenarPor === 'pedidos' ? 'Cantidad de Pedidos' : 'Importe Total'],
    ...clientesData
      .sort((a, b) =>
        ordenarPor === 'pedidos' ? b.pedidos - a.pedidos : b.importe - a.importe
      )
      .map((cliente) => [
        cliente.nombre,
        ordenarPor === 'pedidos' ? cliente.pedidos : cliente.importe,
      ]),
  ];
  
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
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value as 'pedidos' | 'importe')}
          >
            <option value="pedidos">Cantidad de pedidos</option>
            <option value="importe">Importe total</option>
          </select>
        </label>

        <button className={styles.exportarBtn}>
          <span className="material-symbols-outlined">file_download</span>
          Exportar a Excel
        </button>
      </div>

      <Chart
        chartType="BarChart"
        width="100%"
        height="300px"
        data={datosGrafico}
        options={{
          legend: { position: 'none' },
          chartArea: { width: '70%' },
          hAxis: {
            title: ordenarPor === 'pedidos' ? 'Cantidad de Pedidos' : 'Importe Total',
            minValue: 0,
          },
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
            {clientesData
              .sort((a, b) =>
                ordenarPor === 'pedidos' ? b.pedidos - a.pedidos : b.importe - a.importe
              )
              .map((cliente, i) => (
                <tr key={i}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.pedidos}</td>
                  <td>${cliente.importe.toLocaleString()}</td>
                  <td>
                    <button className={styles.verPedidosBtn}>
                      Ver pedidos
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientStats
