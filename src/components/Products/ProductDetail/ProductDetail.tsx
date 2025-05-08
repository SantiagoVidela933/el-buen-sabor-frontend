import { useState } from 'react';
import styles from './ProductDetail.module.css';
import { Product } from '../../../models/Product';

interface ProductDetailProps {
    product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {

    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className={styles.detail_wrapper}>
      <div className={styles.detail_image}>
        <img src={product.image} alt="Product Image" />
      </div>
      <div className={styles.detail_info}>
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p>Precio: ${product.price}</p>
        <span>STOCK</span>
      </div>
      <div className={styles.detail_actions}>
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

export default ProductDetail
