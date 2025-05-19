import Chart from 'react-google-charts';
import styles from './Movimientos.module.css'; 
import { useState } from 'react';

const Movimientos = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Datos simulados por día
  const movimientos = [
    { fecha: 'Enero', ingresos: 15000, costos: 8000 },
    { fecha: 'Febrero', ingresos: 18000, costos: 9500 },
    { fecha: 'Marzo', ingresos: 12000, costos: 7000 },
    { fecha: 'Abril', ingresos: 20000, costos: 11000 },
    { fecha: 'Mayo', ingresos: 17000, costos: 9000 },
  ];

  // Armado de datos para el gráfico
  const data = [
    ['Fecha', 'Ingresos', 'Costos', 'Ganancias'],
    ...movimientos.map((m) => [
      m.fecha,
      m.ingresos,
      m.costos,
      m.ingresos - m.costos,
    ]),
  ];

  const totalIngresos = movimientos.reduce((acc, m) => acc + m.ingresos, 0);
  const totalCostos = movimientos.reduce((acc, m) => acc + m.costos, 0);
  const totalGanancias = totalIngresos - totalCostos;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Movimientos monetarios</h2>

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

        <button className={styles.exportarBtn}>
          <span className="material-symbols-outlined">file_download</span>
          Exportar a Excel
        </button>
      </div>

      <Chart
        chartType="LineChart"
        width="100%"
        height="350px"
        data={data}
        options={{
          title: 'Ingresos, Costos y Ganancias',
          curveType: 'function',
          legend: { position: 'bottom' },
          chartArea: { width: '80%', height: '70%' },
        }}
      />

      <div className={styles.resumen}>
        <div className={styles.card}>
          <h4>Ingresos Totales</h4>
          <p>${totalIngresos.toLocaleString()}</p>
        </div>
        <div className={styles.card}>
          <h4>Costos Totales</h4>
          <p>${totalCostos.toLocaleString()}</p>
        </div>
        <div className={styles.card}>
          <h4>Ganancias</h4>
          <p>${totalGanancias.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default Movimientos
