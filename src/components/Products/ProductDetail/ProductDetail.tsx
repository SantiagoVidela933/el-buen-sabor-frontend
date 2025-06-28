import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './ProductDetail.module.css';
import { ArticuloVenta } from '../../../models/ArticuloVenta';
import { addToCart } from '../../../redux/slices/cartSlice';
import { AppDispatch } from '../../../redux/store';

interface ProductDetailProps {
  articuloVenta: ArticuloVenta;
  onClose: () => void;
}

const ProductDetail = ({ articuloVenta, onClose }: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();


  const handleIncrease = () => {
    if (quantity < articuloVenta.stockDisponible) {
      setQuantity(prev => prev + 1);
      setError('');
    } else {
      setError(`Cantidad máxima disponible para comprar: ${articuloVenta.stockDisponible}`);
    }
  };

  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    setError('');
  };

  const handleAdd = () => {
    if (quantity <= articuloVenta.stockDisponible) {
      dispatch(addToCart({ articuloVenta, quantity }));
      onClose();
    } else {
      setError(`Cantidad máxima disponible para comprar: ${articuloVenta.stockDisponible}`);
    }
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
        
      </div>
      <div className={styles.detail_actions}>
        <div className={styles.counter}>
          <button onClick={handleDecrease}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>
        <span>${articuloVenta.precioVenta * quantity}</span>
        <button onClick={handleAdd}>Agregar al carrito</button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default ProductDetail;
