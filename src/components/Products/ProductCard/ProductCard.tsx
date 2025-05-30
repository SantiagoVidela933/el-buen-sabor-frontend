import { ArticuloManufacturado } from '../../../models/ArticuloManufacturado';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: ArticuloManufacturado;
  onClick?: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <div className={styles.card_wrapper} onClick={onClick}>
      <div className={styles.box_image}>
        <img
          src={
            product.imagenes && product.imagenes.length > 0
              ? `http://localhost:8080/api/imagenes/file/${product.imagenes[0].nombre}`
              : '/src/assets/images/pizza_example.jpg'
          }
          alt={product.denominacion}
        />
      </div>
      <div className={styles.box_info}>
        <h3 className={styles.card_title}>{product.denominacion}</h3>
        <p className={styles.card_description}>{product.descripcion}</p>
        <p className={styles.card_price}>${product.precioVenta}</p>
        {product.estado === false && (
          <span className={styles.outOfStock}>Sin Stock</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
