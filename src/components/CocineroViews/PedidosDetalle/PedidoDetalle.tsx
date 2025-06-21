import styles from "./PedidoDetalle.module.css";
import { PedidoVenta } from "../../../models/PedidoVenta";
import { ArticuloManufacturadoDetalle } from "../../../models/ArticuloManufacturadoDetalle";
import { ArticuloManufacturado } from "../../../models/ArticuloManufacturado";
import { useState } from "react";

type PedidoDetalleProps = {
  pedido: PedidoVenta;
  actualizarMinutosExtra: (pedidoId: number, minutosExtra: number) => Promise<void>;
  onClose: () => void;
};

const PedidoDetalle = ({ pedido, actualizarMinutosExtra, onClose  }: PedidoDetalleProps) => {

  const [minutosExtra, setMinutosExtra] = useState<number>(pedido.minutosExtra ?? 0);

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

  const handleMinutosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value) || value < 0) return; 
    setMinutosExtra(value);
  };

  const handleGuardarMinutosExtra = async () => {
    await actualizarMinutosExtra(pedido.id, minutosExtra);
    onClose();
  };

  if (!pedido) return <p>Pedido no disponible</p>;
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Detalle del Pedido #{pedido.id}</h2>

      <div className={styles.infoBox}>
        <p className={styles.detail}>
          <strong>Hora estimada de entrega:</strong>{" "}
          {pedido.horaEstimadaEntrega?.slice(0, 5) || "No disponible"}
        </p>
        <p className={styles.detail}>
          <strong>Minutos extra actuales:</strong> {pedido.minutosExtra ?? 0} minutos
        </p>
      </div>

      <div className={styles.extraTimeBox}>
        <label htmlFor="minutosExtraInput">
          <strong>Agregar minutos de demora:</strong>
        </label>
        <div className={styles.extraTimeInputGroup}>
          <input
            id="minutosExtraInput"
            type="number"
            min={0}
            value={minutosExtra}
            onChange={handleMinutosChange}
            className={styles.input}
          />
          <button onClick={handleGuardarMinutosExtra} className={styles.button}>
            Guardar
          </button>
        </div>
      </div>

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
              if (!articulo) return null;
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
