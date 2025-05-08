import { useState } from 'react';
import styles from './Category.module.css';

interface CategoryProps {
  onCategoryChange: (category: string) => void;
}

const Category = ({ onCategoryChange }: CategoryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Estado para categoría seleccionada

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category); // Actualiza la categoría seleccionada
    onCategoryChange(category); // Notifica al componente padre
  };

  return (
    <div className={styles.category_wrapper}>
      <div className={styles.category_box_title}>
        <p>Categorías</p>
      </div>
      <div className={styles.category_box_ul}>
        <ul className={styles.category_ul}>
          <li aria-label='pizza'>
            <button
              onClick={() => handleCategoryClick('pizza')}
              className={selectedCategory === 'pizza' ? styles.selected : ''}
            >
              <span className="material-symbols-outlined">local_pizza</span>
            </button>
          </li>
          <li aria-label='burger'>
            <button
              onClick={() => handleCategoryClick('burger')}
              className={selectedCategory === 'burger' ? styles.selected : ''}
            >
              <span className="material-symbols-outlined">lunch_dining</span>
            </button>
          </li>
          <li aria-label='bebida'>
            <button
              onClick={() => handleCategoryClick('bebida')}
              className={selectedCategory === 'bebida' ? styles.selected : ''}
            >
              <span className="material-symbols-outlined">local_bar</span>
            </button>
          </li>
          <li aria-label='papas'>
            <button
              onClick={() => handleCategoryClick('papas')}
              className={selectedCategory === 'papas' ? styles.selected : ''}
            >
              <span className="material-symbols-outlined">fastfood</span>
            </button>
          </li>
          <li aria-label='panchos'>
            <button
              onClick={() => handleCategoryClick('panchos')}
              className={selectedCategory === 'panchos' ? styles.selected : ''}
            >
              <span className="material-symbols-outlined">bakery_dining</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Category;
