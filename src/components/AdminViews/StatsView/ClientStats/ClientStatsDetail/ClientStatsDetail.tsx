import styles from "./ClientStatsDetail.module.css";
import { useEffect, useState } from "react";
import { PedidoVenta } from "../../../../../models/PedidoVenta";
import { getPedidosVentasPorCliente } from "../../../../../api/pedidoVenta";


interface ClienteStatsDetailsProps {
  clienteId: number | null;
}

const ClienteStatsDetails: React.FC<ClienteStatsDetailsProps> = ({ clienteId }) => {
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);

    const formatoMoneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  // fetch - obtengo categorias de articulos manufacturados
  useEffect(() => {
    const fetchPedidos = async () => {
      if(clienteId === null) return;
      try {
        const data = await getPedidosVentasPorCliente(clienteId);
        console.log(data);
        setPedidos(data);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      }
    };
    fetchPedidos();
  }, [clienteId]);

  const formatoARS = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  return (
    <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Nro pedido</th>
              <th>Total</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyMessage}>
                  No hay pedidos
                </td>
              </tr>
            ) : (
              pedidos.map((order) => (
                <tr key={order.id}>
                  <td>
                    {new Date(order.fechaPedido).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    {order.horaPedido}
                  </td>
                  <td>#{order.id}</td>
                  <td>{formatoARS.format(order.totalVenta)}</td>
                  <td>
                    <table className={styles.productTable}>
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                          <th>Sub total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.pedidosVentaDetalle
                          ?.filter((detalle) => detalle.articulo?.tipoArticulo === "manufacturado")
                          .map((detalle, index) => (
                            <tr key={index}>
                              <td>{detalle.articulo?.denominacion || "Producto sin nombre"}</td>
                              <td>{detalle.cantidad}</td>
                              <td>{formatoMoneda.format(detalle.subtotal / detalle.cantidad)}</td>
                              <td>{formatoMoneda.format(detalle.subtotal)}</td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
  </div>
  );

};

export default ClienteStatsDetails;
