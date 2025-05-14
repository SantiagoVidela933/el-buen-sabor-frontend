import { useState } from 'react';
import styles from './Category.module.css';

interface CategoryProps {
  onCategoryChange: (category: string) => void;
}

const Category = ({ onCategoryChange }: CategoryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const getButtonClass = (category: string) =>
    `${styles.category_button} ${selectedCategory === category ? styles.selected : ''}`;

  return (
    <div className={styles.category_wrapper}>
      <div className={styles.category_box_title}>
        <p className={styles.category_title_text}>Categorías</p>
      </div>
      <div className={styles.category_box_ul}>
        <ul className={styles.category_ul}>
          <li className={styles.category_li} aria-label='pizza'>
            <button onClick={() => handleCategoryClick('pizza')} className={getButtonClass('pizza')}>
              <span className="material-symbols-outlined">local_pizza</span>
            </button>
          </li>
          <li className={styles.category_li} aria-label='burger'>
            <button onClick={() => handleCategoryClick('burger')} className={getButtonClass('burger')}>
              <span className="material-symbols-outlined">lunch_dining</span>
            </button>
          </li>
          <li className={styles.category_li} aria-label='bebida'>
            <button onClick={() => handleCategoryClick('bebida')} className={getButtonClass('bebida')}>
              <span className="material-symbols-outlined">local_bar</span>
            </button>
          </li>
          <li className={styles.category_li} aria-label='papas'>
            <button onClick={() => handleCategoryClick('papas')} className={getButtonClass('papas')}>
              <span className="material-symbols-outlined">fastfood</span>
            </button>
          </li>
          <li className={styles.category_li} aria-label='panchos'>
            <button onClick={() => handleCategoryClick('panchos')} className={getButtonClass('panchos')}>
              <span className="material-symbols-outlined">bakery_dining</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Category;
