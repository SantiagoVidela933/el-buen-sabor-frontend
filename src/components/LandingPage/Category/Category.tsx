import styles from './Category.module.css';

const Category = () => {
  return (
    <>
        <div className={styles.category_wrapper}>
            <div className={styles.category_box_title}>
                <p>Categorías:</p>
            </div>
            <div className={styles.category_box_ul}>
                <ul className={styles.category_ul}>
                    <li><button><span className="material-symbols-outlined">lunch_dining</span></button></li>
                    <li><button><span className="material-symbols-outlined">local_pizza</span></button></li>
                    <li><button><span className="material-symbols-outlined">local_bar</span></button></li>
                    <li><button><span className="material-symbols-outlined">egg_alt</span></button></li>
                </ul>
            </div>
            <div className={styles.box_display}></div>
        </div>  
    </>
  )
}

export default Category
