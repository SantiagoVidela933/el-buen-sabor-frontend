import { useEffect, useState } from 'react';
import styles from './Category.module.css';
import { CategoriaArticulo } from '../../../models/CategoriaArticulo';
import { getCategoriasMenuBySucursalId } from '../../../api/articuloCategoria';

interface CategoryProps {
  onCategoryChange: (categoryId: number) => void;
  selectedCategory: number;
}

const Category = ({ onCategoryChange, selectedCategory }: CategoryProps) => {
  const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>("Todos");

  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await getCategoriasMenuBySucursalId(1);
      setCategorias(data);
      if (selectedCategory !== 0) {
        const current = data.find(cat => cat.id === selectedCategory);
        setSelectedLabel(current?.denominacion || "Todos");
      }
    };
    fetchCategorias();
  }, [selectedCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value);
    onCategoryChange(categoryId);

    const selected = categoryId === 0
      ? "Todos"
      : categorias.find(cat => cat.id === categoryId)?.denominacion ?? "Todos";

    setSelectedLabel(selected);
  };

  return (
    <div className={styles.category_wrapper}>
      <div className={styles.category_box_title}>
        <p className={styles.category_title_text}>Hola. ¿Qué vas a pedir hoy?</p>
      </div>
      <div className={styles.category_select_wrapper}>
        <div className={styles.category_select_container}>
          <span className={styles.category_icon}>🍽️</span>
          <select
            className={styles.category_select}
            value={selectedCategory}
            onChange={handleChange}
          >
            <option value={0}>Todos</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.denominacion}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Category;
