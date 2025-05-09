import styles from './CartView.module.css';

interface CartViewProps {
    onClose: ()=> void;
}

const CartView = ({onClose}: CartViewProps) => {
  return (
    <div className={styles.cartView_wrapper}>
      <div className={styles.cartView_title}>
        <h3>CARRITO DE COMPRAS</h3>
      </div>
      <div className={styles.cartView_cart}>
        <div className={styles.cart_products}>
            {/* productos añadidos */}
        </div>
        <div className={styles.cart_resumen}>
            
        </div>
      </div>
      <button onClick={onClose}>Cerrar</button>
    </div>
  )
}

export default CartView
