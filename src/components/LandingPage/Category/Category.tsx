import styles from './Category.module.css';

interface CategoryProps {
  onCategoryChange: (category: string) => void;
}

const Category = ({ onCategoryChange }: CategoryProps) => {
  
  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
  };

  return (
    <div className={styles.category_wrapper}>
      <div className={styles.category_box_title}>
        <p>Categorías:</p>
      </div>
      <div className={styles.category_box_ul}>
        <ul className={styles.category_ul}>
          <li aria-label='pizza'>
            <button onClick={() => handleCategoryClick('pizza')}>
              <span className="material-symbols-outlined">lunch_dining</span>
            </button>
          </li>
          <li aria-label='burger'>
            <button onClick={() => handleCategoryClick('burger')}>
              <span className="material-symbols-outlined">local_pizza</span>
            </button>
          </li>
          <li aria-label='bebida'>
            <button onClick={() => handleCategoryClick('bebida')}>
              <span className="material-symbols-outlined">local_bar</span>
            </button>
          </li>
          <li aria-label='papas-fritas'>
            <button onClick={() => handleCategoryClick('papas')}>
              <span className="material-symbols-outlined">egg_alt</span>
            </button>
          </li>
          <li aria-label='panchos'>
            <button onClick={() => handleCategoryClick('panchos')}>
              <span className="material-symbols-outlined">egg_alt</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Category;
