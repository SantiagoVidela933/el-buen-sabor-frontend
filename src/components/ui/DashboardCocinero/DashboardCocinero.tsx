import { useState } from 'react';
import styles from './DashboardCocinero.module.css'; // Asegúrate que el nombre del archivo CSS es correcto

interface DashboardProps { // Usamos DashboardProps para mantener consistencia con el nombre del componente anterior
  onSelect: (view: string) => void;
}

const Dashboard = ({ onSelect }: DashboardProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  // Nuevo estado para controlar si una vista ya ha sido seleccionada
  const [viewSelected, setViewSelected] = useState(false);

  const toggleSection = (section: string) => {
    setExpanded(prev => (prev === section ? null : section));
    // Importante: No cambiamos 'viewSelected' aquí. Solo se expande/contrae la sección.
  };

  // Esta función encapsula la llamada a onSelect y actualiza el estado de la altura
  const handleSelect = (view: string) => {
    onSelect(view); // Llama a la función 'onSelect' pasada por props para cambiar la vista principal
    setViewSelected(true); // Una vez que se selecciona una vista, el dashboard se adaptará a su contenido
  };

  return (
    // Aplica la clase 'initialHeight' solo si 'viewSelected' es falso
    <aside className={`${styles.sidebar} ${!viewSelected ? styles.initialHeight : ''}`}>
      <div className={styles.section}>
        <button onClick={() => toggleSection('pedidos')}>Pedidos</button>
        {expanded === 'pedidos' && (
          <div className={styles.subsection}>
            {/* Usamos handleSelect aquí para que se active la altura dinámica */}
            <button onClick={() => handleSelect('pedidos')}>Grilla de pedidos a cocinar</button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button onClick={() => toggleSection('stock')}>Stock</button>
        {expanded === 'stock' && (
          <div className={styles.subsection}>
            {/* Usamos handleSelect aquí */}
            <button onClick={() => handleSelect('stockProducto')}>Productos</button>
            <button onClick={() => handleSelect('stockIngrediente')}>Ingredientes</button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button onClick={() => toggleSection('rubros')}>Rubros</button>
        {expanded === 'rubros' && (
          <div className={styles.subsection}>
            {/* Usamos handleSelect aquí */}
            <button onClick={() => handleSelect('rubroProducto')}>Productos</button>
            <button onClick={() => handleSelect('rubroIngrediente')}>Ingredientes</button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Dashboard;