import { ArticuloManufacturado } from '../../../models/ArticuloManufacturado';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

interface ProductListProps {
  articulosManufacturados: ArticuloManufacturado[];
  onProductClick: (product: ArticuloManufacturado) => void;
}

const ProductList: React.FC<ProductListProps> = ({ articulosManufacturados, onProductClick }) => {
  return (
    <div className={styles.productList_wrapper}>
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
