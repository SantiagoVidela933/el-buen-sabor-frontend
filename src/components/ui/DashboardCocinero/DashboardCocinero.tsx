import { useState } from 'react';
import styles from './DashboardCocinero.module.css'; 

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
        <button onClick={() => toggleSection('pedidos')}>Pedidos</button>
        {expanded === 'pedidos' && (
          <div className={styles.subsection}>
            <button onClick={() => handleSelect('pedidos')}>Grilla de pedidos a cocinar</button>
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
        <button onClick={() => toggleSection('rubros')}>Rubros</button>
        {expanded === 'rubros' && (
          <div className={styles.subsection}>
            <button onClick={() => handleSelect('rubroProducto')}>Productos</button>
            <button onClick={() => handleSelect('rubroIngrediente')}>Ingredientes</button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Dashboard;