import React, { useEffect, useRef, useState } from "react";
import styles from "./Promociones.module.css";
import CardPromocion from "./CardPromocion/CardPromocion";
import { FaChevronLeft, FaChevronRight, FaTags } from "react-icons/fa";
import { ArticuloVenta } from "../../../models/ArticuloVenta";
import { getArticulosByTipo } from "../../../api/articuloVenta";


const Promociones: React.FC = () => {
  const [promociones, setPromociones] = useState<ArticuloVenta[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const data = await getArticulosByTipo(1, "promocion"); // ID de sucursal = 1
        setPromociones(data);
      } catch (error) {
        console.error("Error al cargar las promociones:", error);
      }
    };

    fetchPromociones();
  }, []);

  const scroll = (direction: "left" | "right") => {
    const scrollAmount = 300;
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>
        NUESTRAS PROMOCIONES
        <FaTags className={styles.icono} />
      </h2>

      <div className={styles.carouselWrapper}>
        <button onClick={() => scroll("left")} className={styles.flecha}>
          <FaChevronLeft />
        </button>
        <div className={styles.carousel} ref={carouselRef}>
          {promociones.map((promo) => (
            <CardPromocion
                  key={promo.id}
                  titulo={promo.denominacion}
                  descripcion={promo.descripcion || "Sin descripción"}
                  precioActual={`$${promo.precioVenta}`}
                  precioAnterior={`$${(promo.precioVenta * 1.2).toFixed(2)}`}
                  imagenUrl={`http://localhost:8080/api/imagenes/file/${promo.imagenUrl}`}
                  stockDisponible={promo.stockDisponible}
                  id={promo.id}
            />
          ))}
        </div>
        <button onClick={() => scroll("right")} className={styles.flecha}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Promociones;
