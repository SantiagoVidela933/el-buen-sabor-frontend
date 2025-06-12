import { ArticuloManufacturado } from '../../../models/ArticuloManufacturado';
import styles from './ProductCart.module.css';

interface ProductCartProps {
  articuloManufacturado: ArticuloManufacturado;
  quantity: number;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
}

const ProductCart = ({
  articuloManufacturado,
  quantity,
  removeFromCart,
  updateQuantity,
}: ProductCartProps) => {
  const handleIncrease = () => {
    updateQuantity(articuloManufacturado.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(articuloManufacturado.id, quantity - 1);
    }
  };

  return (
    <div className={styles.card_wrapper}>
      <div className={styles.box_image}>
        <img src={
            articuloManufacturado.imagenes && articuloManufacturado.imagenes.length > 0
              ? `http://localhost:8080/api/imagenes/file/${articuloManufacturado.imagenes[0].denominacion}`
              : '/src/assets/images/pizza_example.jpg'
          } alt={articuloManufacturado.denominacion} />
      </div>

      <div className={styles.box_info}>
        <h3 className={styles.card_title}>{articuloManufacturado.denominacion}</h3>
        <p className={styles.card_description}>{articuloManufacturado.descripcion}</p>
        <p className={styles.card_price}>${articuloManufacturado.precioVenta}</p>
      </div>

      <div className={styles.box_actions}>
        <div className={styles.counter}>
          <button onClick={handleDecrease}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>

        <span>${articuloManufacturado.precioVenta * quantity}</span>

        <button onClick={() => removeFromCart(articuloManufacturado.id)}>Eliminar</button>
      </div>
    </div>
  );
};

export default ProductCart;
