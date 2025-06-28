import styles from './CartButton.module.css';

interface CarritoButtonProps {
  onClick: () => void;
}

const CartButton = ({onClick}: CarritoButtonProps) => {
  return (
    <div className={styles.profile_carrito}>
        <button onClick={onClick}>
          <span className="material-symbols-outlined">local_mall</span>
        </button>
    </div>
  )
}

export default CartButton
