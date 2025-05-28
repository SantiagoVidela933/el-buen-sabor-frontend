import { ArticuloManufacturado } from '../../../models/ArticuloManufacturado';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

interface ProductListProps {
  articulosManufacturados: ArticuloManufacturado[];
  onProductClick: (product: ArticuloManufacturado) => void;
}

const ProductList: React.FC<ProductListProps> = ({ articulosManufacturados, onProductClick }) => {

  // console.log("Rendering ProductList con:", articulosManufacturados);

  return (
    <div className={styles.productList_wrapper}>
      {/* {articulosManufacturados.length === 0 && <p>No hay artículos para mostrar</p>} */}
      {articulosManufacturados.map((artManu) => (
        <ProductCard 
          key={artManu.id} 
          product={artManu} 
          onClick={() => onProductClick(artManu)}
        />
      ))}
    </div>
  );
};

export default ProductList;
