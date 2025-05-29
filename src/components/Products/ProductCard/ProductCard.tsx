import { ArticuloManufacturado } from '../../../models/ArticuloManufacturado';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: ArticuloManufacturado;
  onClick?: () => void;
}

// componente propio de cada producto
const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div className={styles.card_wrapper} onClick={onClick}>
      <div className={styles.box_image}>
        <img src="/src/assets/images/pizza_example.jpg" alt={product.denominacion} />
      </div>
      <div className={styles.box_info}>
        <h3 className={styles.card_title}>{product.denominacion}</h3>
        <p className={styles.card_description}>{product.descripcion}</p>
        <p className={styles.card_price}>${product.precioVenta}</p>
      </div>
    </div>
  );
};

export default ProductCard;
