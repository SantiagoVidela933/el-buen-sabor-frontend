import { useState } from 'react';
import styles from './Dashboard.module.css';

interface DashboardProps {
  onSelect: (view: string) => void;
}

const Dashboard = ({ onSelect }: DashboardProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpanded(prev => (prev === section ? null : section));
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <button onClick={() => toggleSection('usuarios')}>Usuarios</button>
        {expanded === 'usuarios' && (
          <div className={styles.subsection}>
            <button onClick={() => onSelect('userEmpleado')}>Empleados</button>
            <button onClick={() => onSelect('userCliente')}>Clientes</button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button onClick={() => toggleSection('stock')}>Stock</button>
        {expanded === 'stock' && (
          <div className={styles.subsection}>
            <button onClick={() => onSelect('stockProducto')}>Productos</button>
            <button onClick={() => onSelect('stockIngrediente')}>Ingredientes</button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button onClick={() => toggleSection('rubros')}>Rubros</button>
        {expanded === 'rubros' && (
          <div className={styles.subsection}>
            <button onClick={() => onSelect('rubroProducto')}>Productos</button>
            <button onClick={() => onSelect('rubroIngrediente')}>Ingredientes</button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button onClick={() => toggleSection('estadisticas')}>Estadísticas</button>
        {expanded === 'estadisticas' && (
          <div className={styles.subsection}>
            <button onClick={() => onSelect('productStats')}>Ranking productos</button>
            <button onClick={() => onSelect('clientStats')}>Ranking clientes</button>
            <button onClick={() => onSelect('movimientos')}>Movimientos monetarios</button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button onClick={() => toggleSection('facturacion')}>Facturación</button>
        {expanded === 'facturacion' && (
          <div className={styles.subsection}>
            <button onClick={() => onSelect('facturas')}>Generar facturas</button>
            <button onClick={() => onSelect('notasCredito')}>Notas de crédito</button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Dashboard;
