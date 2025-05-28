import { useState } from 'react';
import styles from './ProductDetail.module.css';
import { useCart } from '../../../hooks/useCart';
import { ArticuloManufacturado } from '../../../models/ArticuloManufacturado';

interface ProductDetailProps {
  articuloManufacturado: ArticuloManufacturado;
  onClose: () => void;
}

const ProductDetail = ({ articuloManufacturado, onClose }: ProductDetailProps) => {

  const [quantity, setQuantity] = useState(1);
  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // hook para acceder a las funciones del carrito
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(articuloManufacturado, quantity);
    onClose(); 
  };

  return (
    <div className={styles.detail_wrapper}>
      <div className={styles.detail_image}>
        {/* <img src={articuloManufacturado.image?.path} alt="Product Image" /> */}
      </div>
      <div className={styles.detail_info}>
        <h2>{articuloManufacturado.denominacion}</h2>
        <p>{articuloManufacturado.descripcion}</p>
        <p>Precio: ${articuloManufacturado.precioCosto}</p>
        <span>STOCK</span>
      </div>
      <div className={styles.detail_actions}>
        <div className={styles.counter}>
          <button onClick={handleDecrease}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>
        <span>${articuloManufacturado.precioCosto * quantity}</span>
        <button onClick={handleAdd}>Agregar al carrito</button>
      </div>
    </div>
  )
}

export default ProductDetail
