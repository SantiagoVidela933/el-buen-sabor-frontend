import { useEffect, useState } from 'react';
import styles from './Category.module.css';
import { CategoriaArticulo } from '../../../models/CategoriaArticulo';
import { getCategoriasMenuBySucursalId } from '../../../api/articuloCategoria';

interface CategoryProps {
  categorias: CategoriaArticulo[];
  onCategoryChange: (categoryId: number) => void;
  selectedCategory: number;
}

const Category = ({ onCategoryChange }: CategoryProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await getCategoriasMenuBySucursalId(1);
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    onCategoryChange(categoryId);
  };

  const getButtonClass = (categoryId: number) =>
    `${styles.category_button} ${selectedCategoryId === categoryId ? styles.selected : ''}`;

  const getIconByDenominacion = (denominacion: string): string => {
    switch (denominacion.toLowerCase()) {
      case 'pizzas':
        return 'local_pizza';
      case 'hamburguesa':
        return 'lunch_dining';
      case 'bebida':
        return 'local_bar';
      case 'papas fritas':
        return 'fastfood';
      case 'pancho':
        return 'bakery_dining';
      default:
        return 'category';
    }
  };

  return (
    <div className={styles.category_wrapper}>
      <div className={styles.category_box_title}>
        <p className={styles.category_title_text}>Hola. ¿Que vas a pedir hoy?</p>
      </div>
      <div className={styles.category_box_ul}>
        <ul className={styles.category_ul}>
          <li className={styles.category_li}>
            <button
              onClick={() => handleCategoryClick(0)} 
              className={getButtonClass(0)}
            >
              <span >Todos</span>
            </button>
          </li>
          {categorias.map((cat) => (
            <li key={cat.id} className={styles.category_li} aria-label={cat.denominacion.toLowerCase()}>
              <button
                onClick={() => handleCategoryClick(cat.id)}
                className={getButtonClass(cat.id)}
              >
                <span className="material-symbols-outlined">{getIconByDenominacion(cat.denominacion)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
