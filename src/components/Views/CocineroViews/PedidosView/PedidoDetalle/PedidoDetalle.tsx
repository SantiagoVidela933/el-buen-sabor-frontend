import React from "react";
import styles from "./PedidoDetalle.module.css";
import { PedidoCocinero } from "../../../../../models/Orders/PedidoCocinero";

type PedidoDetalleProps = {
  pedido: PedidoCocinero;
};

const PedidoDetalle = ({ pedido }: PedidoDetalleProps) => {
  const handleVerReceta = (receta?: string) => {
    if (!receta) {
      alert("No hay receta disponible.");
      return;
    }
    alert(`Receta:\n${receta}`);
  };

  if (!pedido) return <p>Pedido no disponible</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Detalle del Pedido</h2>
      <p className={styles.detail}>
        <strong>Número de Pedido:</strong> {pedido.pedido}
      </p>
      <p className={styles.detail}>
        <strong>Hora Estimada:</strong> {pedido.horaEstimada || "No disponible"}
      </p>

      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Receta</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {pedido.productos && pedido.productos.length > 0 ? (
            pedido.productos.map(({ product, cantidad }, index) => (
              <tr key={index}>
                <td>{product?.title || "Producto desconocido"}</td>
                <td>
                  <button
                    className={styles.recetaButton}
                    onClick={() =>
                      handleVerReceta(product?.recipe ? product.recipe.toString() : undefined)
                    }
                  >
                    Ver receta
                  </button>
                </td>
                <td>{cantidad}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No hay productos para este pedido.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PedidoDetalle;
