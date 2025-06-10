import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './ProductDetail.module.css';
import { ArticuloManufacturado } from '../../../models/ArticuloManufacturado';
import { addToCart } from '../../../redux/slices/cartSlice';

interface ProductDetailProps {
  articuloManufacturado: ArticuloManufacturado;
  onClose: () => void;
}

const ProductDetail = ({ articuloManufacturado, onClose }: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addToCart({ articuloManufacturado, quantity }));
    onClose();
  };

  return (
    <div className={styles.detail_wrapper}>
      <div className={styles.detail_image}>
        <img 
          src={
            articuloManufacturado.imagenes && articuloManufacturado.imagenes.length > 0
              ? `http://localhost:8080/api/imagenes/file/${articuloManufacturado.imagenes[0].denominacion}`
              : '/src/assets/images/pizza_example.jpg'
            }
          alt="Product Image" 
        />
      </div>
      <div className={styles.detail_info}>
        <h2>{articuloManufacturado.denominacion}</h2>
        <p>{articuloManufacturado.descripcion}</p>
        <p>Precio: ${articuloManufacturado.precioVenta}</p>
        <span>STOCK</span>
      </div>
      <div className={styles.detail_actions}>
        <div className={styles.counter}>
          <button onClick={handleDecrease}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>
        <span>${articuloManufacturado.precioVenta * quantity}</span>
        <button onClick={handleAdd}>Agregar al carrito</button>
      </div>
    </div>
  );
};

export default ProductDetail;
