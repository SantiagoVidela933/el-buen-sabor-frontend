import { useEffect } from 'react';
import { ArticuloVenta } from '../../../models/ArticuloVenta';
import styles from './ProductCard.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { checkStoreStatus } from '../../../redux/slices/cartSlice';
import { RootState } from '../../../redux/store';
import { AppDispatch } from '../../../redux/store';
import Swal from 'sweetalert2';

interface ProductCardProps {
  product: ArticuloVenta;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const isOutOfStock = product.stockDisponible <= 0;

  const dispatch = useDispatch<AppDispatch>();
  const { isStoreOpen, storeHours } = useSelector((state: RootState) => state.cart);
  
  useEffect(() => {
    dispatch(checkStoreStatus());
  }, [dispatch]);

const handleClick = () => {
    if (isOutOfStock || !onClick) {
      return;
    }
    
    if (!isStoreOpen) {
      Swal.fire({
        icon: "warning",
        title: "Tienda cerrada",
        text: `Lo sentimos, nuestra tienda está cerrada en este momento. Nuestro horario de atención es de ${storeHours.opening} a ${storeHours.closing}.`,
        confirmButtonText: "Entendido",
        confirmButtonColor: '#ff5722',
      });
    } else {
      onClick();
    }
  };

  return (
    <div
      className={`${styles.card_wrapper} ${isOutOfStock ? styles.disabled : ''}`} 
      onClick={handleClick}
    >
      <div className={styles.box_image}>
        <img
          src={
            product.imagenUrl && product.imagenUrl.length > 0
              ? `http://localhost:8080/api/imagenes/file/${product.imagenUrl}`
              : '/src/assets/images/pizza_example.jpg'
          }
          alt={product.denominacion}
        />
      </div>
      <div className={styles.box_info}>
        <h3 className={styles.card_title}>{product.denominacion}</h3>
        <p className={styles.card_description}>{product.descripcion}</p>
        <p className={styles.card_price}>${product.precioVenta}</p>
        {product.stockDisponible <=0 && (
          <span className={styles.outOfStock}>Sin Stock</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
