import { useEffect, useState } from 'react'
import Chart from 'react-google-charts';
import styles from './ProductStats.module.css';
import { RankingProductos, downloadRankingProductosExcel } from '../../../../api/ranking';

const ProductStats = () => {
  
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [datosCocina, setDatosCocina] = useState([['Producto', 'Cantidad']]);
  const [datosBebidas, setDatosBebidas] = useState([['Producto', 'Cantidad']]);

  const obtenerDatos = async () => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const desde = fechaInicio || '2000-01-01';
    const hasta = fechaFin || fechaActual; 

    try{
      const datos = await RankingProductos(desde, hasta);
      const cocina = datos.comida.map((item: any) => [item.nombre, Number(item.cantidadVendida)]);
      const bebidas = datos.bebida.map((item: any) => [item.nombre, Number(item.cantidadVendida)]);
      
      setDatosCocina([['Producto', 'Cantidad Vendida'], ...cocina]);
      setDatosBebidas([['Producto', 'Cantidad Vendida'], ...bebidas]);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };
  
  const exportarExcel = async () => {
    if (!fechaInicio || !fechaFin) {
      alert('Por favor, selecciona ambas fechas.');
      return;
    }

    try {
      await downloadRankingProductosExcel(fechaInicio, fechaFin);
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
        <button className={styles.exportarBtn} onClick={exportarExcel}>
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
