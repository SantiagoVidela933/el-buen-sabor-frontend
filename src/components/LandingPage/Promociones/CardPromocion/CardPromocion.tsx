import React from "react";
import styles from "./CardPromocion.module.css";

interface CardPromocionProps {
  titulo: string;
  descripcion: string;
  precioActual: string;
  precioAnterior: string;
  imagenUrl: string;
}

const CardPromocion: React.FC<CardPromocionProps> = ({
  titulo,
  descripcion,
  precioActual,
  precioAnterior,
  imagenUrl,
}) => {
  return (
    <div className={styles.card}>
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
  );
};

export default CardPromocion;
