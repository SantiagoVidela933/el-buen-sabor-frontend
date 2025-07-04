import { useState } from 'react';
import styles from './Dashboard.module.css';

interface DashboardProps {
  onSelect: (view: string) => void;
}

const Dashboard = ({ onSelect }: DashboardProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [viewSelected, setViewSelected] = useState(false);

  const toggleSection = (section: string) => {
    setExpanded(prev => (prev === section ? null : section));
  };

  const handleSelect = (view: string) => {
    onSelect(view);
    setViewSelected(true); 
  };

  return (
    <aside className={`${styles.sidebar} ${!viewSelected ? styles.initialHeight : ''}`}>
      <div className={styles.section}>
        <button onClick={() => toggleSection('usuarios')}>Usuarios</button>
        {expanded === 'usuarios' && (
          <div className={styles.subsection}>
            <button onClick={() => handleSelect('userEmpleado')}>Empleados</button>
            <button onClick={() => handleSelect('userCliente')}>Clientes</button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button onClick={() => toggleSection('stock')}>Stock</button>
        {expanded === 'stock' && (
          <div className={styles.subsection}>
            <button onClick={() => handleSelect('stockProducto')}>Productos</button>
            <button onClick={() => handleSelect('stockIngrediente')}>Ingredientes</button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button onClick={() => toggleSection('promociones')}>Promociones</button>
        {expanded === 'promociones' && (
          <div className={styles.subsection}>
            <button onClick={() => onSelect('promociones')}>Promociones de la sucursal</button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button onClick={() => toggleSection('rubros')}>Rubros</button>
        {expanded === 'rubros' && (
          <div className={styles.subsection}>
            <button onClick={() => handleSelect('rubroProducto')}>Productos</button>
            <button onClick={() => handleSelect('rubroIngrediente')}>Ingredientes</button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button onClick={() => toggleSection('estadisticas')}>Estadísticas</button>
        {expanded === 'estadisticas' && (
          <div className={styles.subsection}>
            <button onClick={() => handleSelect('productStats')}>Ranking productos</button>
            <button onClick={() => handleSelect('clientStats')}>Ranking clientes</button>
            <button onClick={() => handleSelect('movimientos')}>Movimientos monetarios</button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button onClick={() => toggleSection('facturacion')}>Facturación</button>
        {expanded === 'facturacion' && (
          <div className={styles.subsection}>
            <button onClick={() => handleSelect('facturacion')}>Facturación de Pedidos</button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Dashboard;