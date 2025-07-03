import { useState } from 'react';
import { ArticuloVenta } from '../../../models/ArticuloVenta';
import styles from './ProductCart.module.css';

interface ProductCartProps {
  articuloVenta: ArticuloVenta;
  quantity: number;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
}

const ProductCart = ({
  articuloVenta,
  quantity,
  removeFromCart,
  updateQuantity,
}: ProductCartProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleIncrease = () => {
    if (quantity + 1 > articuloVenta.stockDisponible) {
      setError(`Cantidad máxima disponible para comprar: ${articuloVenta.stockDisponible}`);
    } else {
      setError(null);
      updateQuantity(articuloVenta.id, quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setError(null);
      updateQuantity(articuloVenta.id, quantity - 1);
    }
  };
  const getImageUrl = () => {
    if (!articuloVenta.imagenUrl || articuloVenta.imagenUrl.length === 0) {
      return '/src/assets/images/pizza_example.jpg';
    }
    
    if (articuloVenta.imagenUrl.startsWith('http')) {
      return articuloVenta.imagenUrl;
    }
    
    return `http://localhost:8080/api/imagenes/file/${articuloVenta.imagenUrl}`;
  };

  return (
    <div className={styles.card_wrapper}>
      <div className={styles.box_image}>
        <img src={getImageUrl()} alt={articuloVenta.denominacion} />
      </div>

      <div className={styles.box_info}>
        <h3 className={styles.card_title}>{articuloVenta.denominacion}</h3>
        <p className={styles.card_description}>{articuloVenta.descripcion}</p>
        <p className={styles.card_price}>${articuloVenta.precioVenta}</p>
      </div>

      <div className={styles.box_actions}>
        <div className={styles.counter}>
          <button onClick={handleDecrease}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>

        <span>${articuloVenta.precioVenta * quantity}</span>
        {error && <p className={styles.error}>{error}</p>}
        <button onClick={() => removeFromCart(articuloVenta.id)}>Eliminar</button>
      </div>
        
    </div>
  );
};

export default ProductCart;
