import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './ProductDetail.module.css';
import { ArticuloVenta } from '../../../models/ArticuloVenta';
import { addToCart } from '../../../redux/slices/cartSlice';

interface ProductDetailProps {
  articuloVenta: ArticuloVenta;
  onClose: () => void;
}

const ProductDetail = ({ articuloVenta, onClose }: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addToCart({ articuloVenta, quantity }));
    onClose();
  };

  return (
    <div className={styles.detail_wrapper}>
      <div className={styles.detail_image}>
        <img 
          src={
            articuloVenta.imagenUrl && articuloVenta.imagenUrl.length > 0
              ? `http://localhost:8080/api/imagenes/file/${articuloVenta.imagenUrl}`
              : '/src/assets/images/pizza_example.jpg'
            }
          alt="Product Image" 
        />
      </div>
      <div className={styles.detail_info}>
        <h2>{articuloVenta.denominacion}</h2>
        <p>{articuloVenta.descripcion}</p>
        <p>Precio: ${articuloVenta.precioVenta}</p>
        <span>STOCK</span>
      </div>
      <div className={styles.detail_actions}>
        <div className={styles.counter}>
          <button onClick={handleDecrease}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>
        <span>${articuloVenta.precioVenta * quantity}</span>
        <button onClick={handleAdd}>Agregar al carrito</button>
      </div>
    </div>
  );
};

export default ProductDetail;
