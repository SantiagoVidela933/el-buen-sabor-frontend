import { useState } from 'react';
import styles from './ProductDetail.module.css';
import { Product } from '../../../models/Products/Product';
import { useCart } from '../../../hooks/useCart';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const ProductDetail = ({ product, onClose }: ProductDetailProps) => {

  const [quantity, setQuantity] = useState(1);
  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // hook para acceder a las funciones del carrito
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose(); 
  };

  return (
    <div className={styles.detail_wrapper}>
      <div className={styles.detail_image}>
        <img src={product.image?.path} alt="Product Image" />
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
        <span>${product.price * quantity}</span>
        <button onClick={handleAdd}>Agregar al carrito</button>
      </div>
    </div>
  )
}

export default ProductDetail
