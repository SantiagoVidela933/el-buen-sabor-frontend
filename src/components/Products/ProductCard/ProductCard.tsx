import { Product } from '../../../models/Product';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

// componente propio de cada producto
const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div className={styles.card_wrapper} onClick={onClick}>
      <div className={styles.box_image}>
        <img src={product.image} alt={product.title} />
      </div>
      <div className={styles.box_info}>
        <h3 className={styles.card_title}>{product.title}</h3>
        <p className={styles.card_description}>{product.description}</p>
        <p className={styles.card_price}>${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
