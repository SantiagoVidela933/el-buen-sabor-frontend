import React, { useState } from "react";
import styles from "./CardPromocion.module.css";
import PromocionDetailCard from "./PromocioDetailCard/PromocionDetailCard";
import { ArticuloVenta } from "../../../../models/ArticuloVenta";
import Modal from '../../../ui/Modal/Modal';

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

  const promocion: ArticuloVenta = {
    id,
    tipo: "PROMOCION",
    denominacion: titulo,
    descripcion,
    categoria: null,
    precioVenta: parseFloat(precioActual.slice(1)),
    imagenUrl,
    stockDisponible
  };

  const handleCardClick = () => {
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <>
      <div className={styles.card} onClick={handleCardClick}>
        <h3 className={styles.titulo}>{titulo}</h3>
        <p className={styles.descripcion}>{descripcion}</p>
        <div className={styles.precios}>
          <span className={styles.precioActual}>{precioActual}</span>
          <span className={styles.precioAnterior}>{precioAnterior}</span>
        </div>
        <div className={styles.imagenWrapper}>
          <img src={imagenUrl} alt={titulo} className={styles.imagen} />
        </div>
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
