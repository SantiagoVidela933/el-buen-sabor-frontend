import { Product } from '../../../models/Product';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

interface ProductListProps {
  products: Product[];
}

// este componente muestra los productos filtrados por Category
const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className={styles.productList_wrapper}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} /> 
      ))}
    </div>
  );
};

export default ProductList;
