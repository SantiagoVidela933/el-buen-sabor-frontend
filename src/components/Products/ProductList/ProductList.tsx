import { Product } from '../../../models/Product';
import ProductCard from '../ProductCard/ProductCard';

interface ProductListProps {
  products: Product[];
}

// este componente muestra los productos filtrados por Category
const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} /> 
      ))}
    </div>
  );
};

export default ProductList;
