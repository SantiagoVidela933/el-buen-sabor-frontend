import { ArticuloVenta } from '../../../models/ArticuloVenta';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: ArticuloVenta;
  onClick?: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const isDisabled = product.stockDisponible<= 0;

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`${styles.card_wrapper} ${isDisabled ? styles.disabled : ''}`}
      onClick={handleClick}
    >
      <div className={styles.box_image}>
        <img
          src={
            product.imagenUrl && product.imagenUrl.length > 0
              ? `http://localhost:8080/api/imagenes/file/${product.imagenUrl}`
              : '/src/assets/images/pizza_example.jpg'
          }
          alt={product.denominacion}
        />
      </div>
      <div className={styles.box_info}>
        <h3 className={styles.card_title}>{product.denominacion}</h3>
        <p className={styles.card_description}>{product.descripcion}</p>
        <p className={styles.card_price}>${product.precioVenta}</p>
        {product.stockDisponible <=0 && (
          <span className={styles.outOfStock}>Sin Stock</span>
        )}
        {isDisabled && (
          <span className={styles.outOfStock}>Sin Stock</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
