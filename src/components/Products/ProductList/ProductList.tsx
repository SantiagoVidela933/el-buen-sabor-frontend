import { ArticuloVenta } from '../../../models/ArticuloVenta';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

interface ProductListProps {
  articuloVenta: ArticuloVenta[];
  onProductClick: (product: ArticuloVenta) => void;
}

const ProductList: React.FC<ProductListProps> = ({ articuloVenta, onProductClick }) => {
  return (
    <div className={styles.productList_wrapper}>
      {articuloVenta.map((articuloVenta) => (
        <ProductCard 
          key={articuloVenta.id} 
          product={articuloVenta} 
          onClick={() => onProductClick(articuloVenta)}
        />
      ))}
    </div>
  );
};

export default ProductList;
