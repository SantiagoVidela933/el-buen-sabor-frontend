import styles from './CarritoButton.module.css';

const CarritoButton = () => {
  return (
    <div className={styles.profile_carrito}>
        <button>
          <span className="material-symbols-outlined">local_mall</span>
        </button>
    </div>
  )
}

export default CarritoButton
