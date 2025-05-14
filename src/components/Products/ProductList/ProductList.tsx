import { Product } from '../../../models/Products/Product';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

interface ProductListProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

// este componente muestra los productos filtrados por Category
const ProductList: React.FC<ProductListProps> = ({ products, onProductClick }) => {
  return (
    <div className={styles.productList_wrapper}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onClick={() => onProductClick(product)}
        /> 
      ))}
    </div>
  );
};

export default ProductList;
