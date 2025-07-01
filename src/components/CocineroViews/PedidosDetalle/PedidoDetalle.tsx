import styles from "./PedidoDetalle.module.css";
import { PedidoVenta } from "../../../models/PedidoVenta";
import { ArticuloManufacturadoDetalle } from "../../../models/ArticuloManufacturadoDetalle";
import { ArticuloManufacturado } from "../../../models/ArticuloManufacturado";
import { useState, useMemo } from "react";

type PedidoDetalleProps = {
  pedido: PedidoVenta;
  actualizarMinutosExtra: (pedidoId: number, minutosExtra: number) => Promise<void>;
  onClose: () => void;
};

interface ArticuloConCantidad {
  articulo: any; 
  cantidad: number;
}

const PedidoDetalle = ({ pedido, actualizarMinutosExtra, onClose  }: PedidoDetalleProps) => {

  const [minutosExtra, setMinutosExtra] = useState<number>(pedido.minutosExtra ?? 0);

    const [recetaModal, setRecetaModal] = useState<ArticuloManufacturadoDetalle[] | null>(null);

    const handleVerReceta = (receta?: ArticuloManufacturadoDetalle[]) => {
    if (!receta || receta.length === 0) {
      alert("No hay receta disponible.");
      return;
    }
    setRecetaModal(receta);
  };

  const handleMinutosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value) || value < 0) return; 
    setMinutosExtra(value);
  };

  const handleGuardarMinutosExtra = async () => {
    if (pedido.id !== undefined) {
      await actualizarMinutosExtra(pedido.id, minutosExtra);
      onClose();
    }
  };

  // Procesar artículos agrupados
  const articulosUnicos = useMemo(() => {
    if (!pedido || !pedido.pedidosVentaDetalle) return [];

    const articulosAgrupados: Record<number, ArticuloConCantidad> = {};
    
    // Recorrer todos los detalles del pedido
    pedido.pedidosVentaDetalle.forEach((detalle) => {
      // Si el detalle tiene un artículo directo
      if (detalle.articulo && detalle.articulo.id) {
        const id = detalle.articulo.id;
        if (articulosAgrupados[id]) {
          // Si ya existe, sumamos la cantidad
          articulosAgrupados[id].cantidad += detalle.cantidad;
        } else {
          // Si no existe, lo agregamos al objeto
          articulosAgrupados[id] = {
            articulo: detalle.articulo,
            cantidad: detalle.cantidad
          };
        }
      }
      
      // Si el detalle tiene una promoción, extraer sus artículos
      if (detalle.promocion && detalle.promocion.promocionesDetalle) {
        detalle.promocion.promocionesDetalle.forEach(promoDetalle => {
          if (promoDetalle.articulo && promoDetalle.articulo.id) {
            const id = promoDetalle.articulo.id;
            const cantidadTotal = promoDetalle.cantidad * detalle.cantidad;
            
            if (articulosAgrupados[id]) {
              // Si ya existe, sumamos la cantidad
              articulosAgrupados[id].cantidad += cantidadTotal;
            } else {
              // Si no existe, lo agregamos al objeto
              articulosAgrupados[id] = {
                articulo: promoDetalle.articulo,
                cantidad: cantidadTotal
              };
            }
          }
        });
      }
    });
    
    // Convertir el objeto de artículos agrupados a un array
    return Object.values(articulosAgrupados);
  }, [pedido]);

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
          {articulosUnicos.length > 0 ? (
            articulosUnicos.map((item, index) => {
              const articulo = item.articulo;
              const esManufacturado = articulo.tipoArticulo === "manufacturado";
              
              return (
                <tr key={`articulo-${index}`}>
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
                  <td>{item.cantidad}</td>
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
      {recetaModal && (
        <div className={styles.modalOverlay} onClick={() => setRecetaModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Receta</h3>
            <ul>
              {recetaModal.map((detalle, index) => (
                <li key={index}>
                  {detalle.cantidad} {detalle.articuloInsumo.unidadMedida.denominacion} de {detalle.articuloInsumo.denominacion}
                </li>
              ))}
            </ul>
            <button onClick={() => setRecetaModal(null)} className={styles.button}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidoDetalle;
