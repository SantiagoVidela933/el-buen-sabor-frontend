import { useState } from 'react';
import styles from './ProductCart.module.css';
import { Product } from '../../../models/Product';

interface ProductCartProps {
    product: Product;
}

const ProductCart = ({product}: ProductCartProps) => {

    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

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
        <span>$2.500</span>
        <button>Agregar al carrito</button>
      </div>
    </div>
  )
}

export default ProductCart
