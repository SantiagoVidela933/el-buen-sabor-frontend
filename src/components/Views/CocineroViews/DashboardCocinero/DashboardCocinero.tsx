import { useState } from 'react';
import styles from './DashboardCocinero.module.css';

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
        <button onClick={() => onSelect('pedidos')}>Pedidos</button>
      </div>

      <div className={styles.section}>
        <button onClick={() => toggleSection('stock')}>Stock</button>
        {expanded === 'stock' && (
          <div className={styles.subsection}>
            <button onClick={() => onSelect('productosStock')}>Productos</button>
            <button onClick={() => onSelect('ingredientesStock')}>Ingredientes</button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button onClick={() => toggleSection('rubros')}>Rubros</button>
        {expanded === 'rubros' && (
          <div className={styles.subsection}>
            <button onClick={() => onSelect('productosRubro')}>Productos</button>
            <button onClick={() => onSelect('ingredientesRubro')}>Ingredientes</button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Dashboard;
