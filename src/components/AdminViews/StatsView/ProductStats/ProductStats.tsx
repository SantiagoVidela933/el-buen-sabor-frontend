import { useState } from 'react'
import Chart from 'react-google-charts';
import styles from './ProductStats.module.css';

const ProductStats = () => {
  
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const datosCocina = [
    ['Producto', 'Cantidad Vendida'],
    ['Hamburguesa clásica', 120],
    ['Pizza muzzarella', 95],
    ['Empanada de carne', 80],
    ['Milanesa napolitana', 75],
    ['Tarta de verdura', 60],
  ];
  
  const datosBebidas = [
    ['Producto', 'Cantidad Vendida'],
    ['Coca-Cola 500ml', 150],
    ['Agua sin gas 500ml', 100],
    ['Fanta 500ml', 85],
    ['Sprite 500ml', 70],
    ['Cerveza artesanal', 50],
  ];

return (
    <div className={styles.container}>
      <h2 className={styles.title}>Ranking de productos más vendidos</h2>

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

      <div className={styles.graficoContainer}>
        <h3 className={styles.subtitulo}>Productos de cocina</h3>
        <Chart
          chartType="BarChart"
          width="100%"
          height="300px"
          data={datosCocina}
          options={{
            legend: { position: 'none' },
            chartArea: { width: '70%' },
            hAxis: {
              title: 'Cantidad Vendida',
              minValue: 0,
            },
          }}
        />
      </div>

      <div className={styles.graficoContainer}>
        <h3 className={styles.subtitulo}>Bebidas</h3>
        <Chart
          chartType="BarChart"
          width="100%"
          height="300px"
          data={datosBebidas}
          options={{
            legend: { position: 'none' },
            chartArea: { width: '70%' },
            hAxis: {
              title: 'Cantidad Vendida',
              minValue: 0,
            },
          }}
        />
      </div>
    </div>
  );
}

export default ProductStats
