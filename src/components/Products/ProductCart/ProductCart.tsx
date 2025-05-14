import styles from './ProductCart.module.css';
import { Product } from '../../../models/Products/Product';

interface ProductCartProps {
  product: Product;
  quantity: number;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
}

const ProductCart = ({
  product,
  quantity,
  removeFromCart,
  updateQuantity,
}: ProductCartProps) => {
  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div className={styles.card_wrapper}>
      <div className={styles.box_image}>
        <img src={product.image} alt={product.title} />
      </div>

      <div className={styles.box_info}>
        <h3 className={styles.card_title}>{product.title}</h3>
        <p className={styles.card_description}>{product.description}</p>
        <p className={styles.card_price}>${product.price}</p>
      </div>

      <div className={styles.box_actions}>
        <div className={styles.counter}>
          <button onClick={handleDecrease}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>

        <span>${product.price * quantity}</span>

        <button onClick={() => removeFromCart(product.id)}>Eliminar</button>
      </div>
    </div>
  );
};

export default ProductCart;
