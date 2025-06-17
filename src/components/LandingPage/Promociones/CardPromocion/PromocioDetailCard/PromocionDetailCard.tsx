import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./PromocionDetailCard.module.css";
import { ArticuloVenta } from "../../../../../models/ArticuloVenta";
import { addToCart } from "../../../../../redux/slices/cartSlice";

interface PromocionDetailCardProps {
    promocion: ArticuloVenta;
    onClose: () => void;
}

const PromocionDetailCard = ({ promocion, onClose }: PromocionDetailCardProps) => {
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    console.log("URL de la imagen en PromocionDetailCard:", promocion.imagenUrl);
    const handleIncrease = () => {
        if (quantity < promocion.stockDisponible) {
        setQuantity((prev) => prev + 1);
        setError("");
        } else {
        setError(`Cantidad máxima disponible para comprar: ${promocion.stockDisponible}`);
        }
    };

    const handleDecrease = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
        setError("");
    };

    const handleAdd = () => {
        if (quantity <= promocion.stockDisponible) {
        dispatch(addToCart({ articuloVenta: promocion, quantity }));
        onClose();
        } else {
        setError(`Cantidad máxima disponible para comprar: ${promocion.stockDisponible}`);
        }
    };

    return (
        <div className={styles.detail_wrapper}>
            <div className={styles.detail_image}>
            <img
                src={
                promocion.imagenUrl && promocion.imagenUrl.length > 0
                    ? `http://localhost:8080/api/imagenes/file/${promocion.imagenUrl}`
                    : "/src/assets/images/pizza_example.jpg" // Imagen por defecto
                }
                alt="Promoción"
            />
            </div>
            <div className={styles.detail_info}>
                <h2>{promocion.denominacion}</h2>
                <p>{promocion.descripcion}</p>
                <p>Precio: ${promocion.precioVenta}</p>
            </div>
            <div className={styles.detail_actions}>
                <div className={styles.counter}>
                <button onClick={handleDecrease}>-</button>
                <span>{quantity}</span>
                <button onClick={handleIncrease}>+</button>
                </div>
                <span>${promocion.precioVenta * quantity}</span>
                <button onClick={handleAdd}>Agregar al carrito</button>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    );
};

export default PromocionDetailCard;