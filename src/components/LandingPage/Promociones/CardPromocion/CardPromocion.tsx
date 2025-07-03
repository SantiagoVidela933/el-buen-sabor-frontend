import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./CardPromocion.module.css";
import PromocionDetailCard from "./PromocioDetailCard/PromocionDetailCard";
import { ArticuloVenta } from "../../../../models/ArticuloVenta";
import Modal from '../../../ui/Modal/Modal';
import { RootState } from "../../../../redux/store";
import { AppDispatch } from "../../../../redux/store";
import { checkStoreStatus } from "../../../../redux/slices/cartSlice";
import  Swal from "sweetalert2";


interface CardPromocionProps {
  titulo: string;
  descripcion: string;
  precioActual: string;
  precioAnterior: string;
  imagenUrl: string;
  stockDisponible?: number;
  id: number;
}

const CardPromocion: React.FC<CardPromocionProps> = ({
  titulo,
  descripcion,
  precioActual,
  precioAnterior,
  imagenUrl,
  stockDisponible = 0,
  id,
}) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const isDisabled = stockDisponible <= 0;

  const dispatch = useDispatch<AppDispatch>();
  const { isStoreOpen, storeHours } = useSelector((state: RootState) => state.cart);
  
  useEffect(() => {
    dispatch(checkStoreStatus());
  }, [dispatch]);


  const promocion: ArticuloVenta = {
    id,
    tipo: "PROMOCION",
    denominacion: titulo,
    descripcion,
    categoriaArticulo: null,
    precioVenta: parseFloat(precioActual.slice(1)),
    imagenUrl,
    stockDisponible
  };

  const handleCardClick = () => {
    if  (isDisabled) {
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
      setIsDetailOpen(true);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <>
      <div
      className={`${styles.card} ${isDisabled ? styles.disabled : ''}`} 
        onClick={handleCardClick}
        >
        <h3 className={styles.titulo}>{titulo}</h3>
        <p className={styles.descripcion}>{descripcion}</p>
        <div className={styles.precios}>
          <span className={styles.precioActual}>{precioActual}</span>
          <span className={styles.precioAnterior}>{precioAnterior}</span>
        </div>
        <div className={styles.imagenWrapper}>
          <img src={imagenUrl} alt={titulo} className={styles.imagen} />
        </div>
        {isDisabled && (
          <span className={styles.outOfStock}>Sin Stock</span>
        )}
      </div>

      {isDetailOpen && (
        <Modal onClose={handleCloseDetail}>
          <PromocionDetailCard promocion={promocion} onClose={handleCloseDetail} />
        </Modal>      
      )}
    </>
  );
};

export default CardPromocion;
