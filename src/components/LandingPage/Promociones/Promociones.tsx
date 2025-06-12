import React, { useRef } from "react";
import styles from "./Promociones.module.css";
import CardPromocion from "./CardPromocion/CardPromocion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

/*IMAGENES*/
import pizzaCoca from "../../../assets/images/Promos/pizza-coca.webp";
import hamburguesaPapas from "../../../assets/images/Promos/hamburguesa-papas.jpg";
import panchoCoca from "../../../assets/images/Promos/pancho-coca.jpeg";

const promociones = [
  {
    titulo: "Pizza + Coca Cola 1.5L",
    descripcion:
      "Pizza muzzarella grande con una gaseosa Coca Cola de 1.5 litros.",
    precioActual: "$5.500",
    precioAnterior: "$6.700",
    imagenUrl: pizzaCoca,
  },
  {
    titulo: "Hamburguesa con Papas",
    descripcion: "Hamburguesa clásica con papas fritas medianas.",
    precioActual: "$4.200",
    precioAnterior: "$5.100",
    imagenUrl: hamburguesaPapas,
  },
  {
    titulo: "Pancho + Coca 500ml",
    descripcion: "Pancho con aderezos y gaseosa Coca Cola de 500ml.",
    precioActual: "$2.900",
    precioAnterior: "$3.400",
    imagenUrl: panchoCoca,
  },
  {
    titulo: "Pizza + Coca Cola 1.5L",
    descripcion:
      "Pizza muzzarella grande con una gaseosa Coca Cola de 1.5 litros.",
    precioActual: "$5.500",
    precioAnterior: "$6.700",
    imagenUrl: pizzaCoca,
  },
  {
    titulo: "Hamburguesa con Papas",
    descripcion: "Hamburguesa clásica con papas fritas medianas.",
    precioActual: "$4.200",
    precioAnterior: "$5.100",
    imagenUrl: hamburguesaPapas,
  },
  {
    titulo: "Pancho + Coca 500ml",
    descripcion: "Pancho con aderezos y gaseosa Coca Cola de 500ml.",
    precioActual: "$2.900",
    precioAnterior: "$3.400",
    imagenUrl: panchoCoca,
  },
];

const Promociones: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

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
      <h2>¡Nuestras promociones!</h2>
      <div className={styles.carouselWrapper}>
        <button onClick={() => scroll("left")} className={styles.flecha}>
          <FaChevronLeft />
        </button>
        <div className={styles.carousel} ref={carouselRef}>
          {promociones.map((promo, index) => (
            <CardPromocion key={index} {...promo} />
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
