import {useState, useEffect} from 'react';
import Chart from 'react-google-charts';
import styles from './Movimientos.module.css'; 
import { downloadMovimientosExcel, fetchMovimientosMensuales, fetchTotales } from '../../../../api/ranking';

const Movimientos = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [movimientosMensuales, setMovimientosMensuales] = useState([['Mes', 'Ingreso', 'Costo', 'Ganancia']]);
  const [totales, setTotales] = useState({ ingreso: 0, costo: 0, ganancia: 0 });

  const obtenerDatos = async () => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const desde = fechaInicio || '2000-01-01';
    const hasta = fechaFin || fechaActual;

    try {
      const dataMensuales = await fetchMovimientosMensuales(desde, hasta);
      const movimientos =
        dataMensuales.length > 0
          ? dataMensuales.map((item: any) => [
              `${item.anio}-${item.mes.toString().padStart(2, '0')}`,
              Number(item.ingreso),
              Number(item.costo),
              Number(item.ganancia),
            ])
          : [['Sin Ventas', 0, 0, 0]];
      setMovimientosMensuales([['Mes', 'Ingreso', 'Costo', 'Ganancia'], ...movimientos]);

      const dataTotales = await fetchTotales(desde, hasta);
      setTotales(dataTotales);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const exportarExcel = async () => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const desde = fechaInicio || '2000-01-01';
    const hasta = fechaFin || fechaActual;

    try {
      await downloadMovimientosExcel(desde, hasta);
      alert('Archivo descargado con éxito.');
    } catch (error) {
      alert('Error al descargar el archivo Excel.');
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, [fechaInicio, fechaFin]);


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

        <button className={styles.exportarBtn} onClick={exportarExcel}>
          <span className="material-symbols-outlined">file_download</span>
          Exportar a Excel
        </button>
      </div>

      <Chart
        chartType="LineChart"
        width="100%"
        height="350px"
        data={movimientosMensuales}
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
          <p>${totales.ingreso ? totales.ingreso.toFixed(2) : 0.00}</p>
        </div>
        <div className={styles.card}>
          <h4>Costos Totales</h4>
          <p>${totales.costo ? totales.costo.toFixed(2) : 0.00}</p>
        </div>
        <div className={styles.card}>
          <h4>Ganancias</h4>
          <p>${totales.ganancia ? totales.ganancia.toFixed(2) : 0.00}</p>
        </div>
      </div>
    </div>
  );
}

export default Movimientos
