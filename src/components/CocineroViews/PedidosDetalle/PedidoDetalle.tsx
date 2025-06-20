import styles from "./PedidoDetalle.module.css";
import { PedidoVenta } from "../../../models/PedidoVenta";
import { ArticuloManufacturadoDetalle } from "../../../models/ArticuloManufacturadoDetalle";
import { ArticuloManufacturado } from "../../../models/ArticuloManufacturado";

type PedidoDetalleProps = {
  pedido: PedidoVenta;
};

const PedidoDetalle = ({ pedido }: PedidoDetalleProps) => {
  const handleVerReceta = (receta?: ArticuloManufacturadoDetalle[]) => {
    if (!receta || receta.length === 0) {
      alert("No hay receta disponible.");
      return;
    }
    const texto = receta
      .map(
        (detalle) =>
          `- ${detalle.cantidad} ${detalle.articuloInsumo.unidadMedida.denominacion} de ${detalle.articuloInsumo.denominacion}`
      )
      .join("\n");

    alert(`Receta:\n${texto}`);
  };
  if (!pedido) return <p>Pedido no disponible</p>;
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Detalle del Pedido #{pedido.id}</h2>

      {/* Tiempo estimado de preparación total */}
      <p className={styles.detail}>
        <strong>Hora estimada de entrega:</strong>{" "}
        {pedido.horaEstimadaEntrega?.slice(0, 5) || "No disponible"}
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
          {pedido.pedidosVentaDetalle.length > 0 ? (
            pedido.pedidosVentaDetalle.map((detalle, index) => {
              const articulo = detalle.articulo;
              if (!articulo) return null; // Evita error si es undefined

              const esManufacturado = articulo.tipoArticulo === "manufacturado";
              return (
                <tr key={index}>
                  <td>{articulo.denominacion}</td>
                  <td>
                    {esManufacturado ? (
                      <button
                        className={styles.recetaButton}
                        onClick={() =>
                          handleVerReceta((articulo as ArticuloManufacturado).detalles)
                        }
                      >
                        Ver receta
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{detalle.cantidad}</td>
                </tr>
              );
            })
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
