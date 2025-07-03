import styles from '../../User/UserOrdetDetail/UserOrderDetail.module.css';
import { useState, useEffect } from 'react';
import { PedidoVenta } from '../../../models/PedidoVenta';
import { FormaPago } from '../../../models/enums/FormaPago';
import { TipoEnvio } from '../../../models/enums/TipoEnvio';
import { Estado } from '../../../models/enums/Estado';
import { getClientePorPedido } from '../../../api/cliente';
import {Cliente} from '../../../models/Cliente';
import { formatearFechaHora } from '../../../api/formatearFechaHora';
import { getPedidoVentaPorId } from '../../../api/pedidoVenta';

interface OrderDetailProps {
  pedidoVenta: PedidoVenta;
  onClose: () => void;
}

const OrderDetail = ({ pedidoVenta, onClose }: OrderDetailProps) => {
  const [pedidoCargado, setPedidoCargado] = useState<PedidoVenta | null>(null);
  const [clienteCompleto, setClienteCompleto] = useState<Cliente | null>(null);
  const [loadingPedido, setLoadingPedido] = useState<boolean>(true);
  const [loadingCliente, setLoadingCliente] = useState<boolean>(false);
  const [errorCliente, setErrorCliente] = useState<string | null>(null);
  const [errorPedido, setErrorPedido] = useState<string | null>(null);

    useEffect(() => {
    const cargarPedido = async () => {
      try {
        if (pedidoVenta.id === undefined) {
          console.error("ID de pedido no disponible");
          setErrorPedido("ID de pedido no disponible");
          return;
        }
        setLoadingPedido(true);
        const pedidoCompleto = await getPedidoVentaPorId(pedidoVenta.id);
        if (!pedidoCompleto.pedidosVentaDetalle) {
          console.error("El pedido no contiene detalles");
          setErrorPedido("No se encontraron detalles del pedido");
          return;
        }
        setPedidoCargado(pedidoCompleto);
      } catch (error) {
        console.error("Error al cargar el pedido completo:", error);
        setErrorPedido("Error al cargar los detalles del pedido");
      } finally {
        setLoadingPedido(false);
      }
    };
    
    cargarPedido();
  }, [pedidoVenta.id]);
  
  
  useEffect(() => {
    const obtenerClienteDetallado = async () => {
      try {
        if (pedidoVenta.id === undefined) {
          setErrorCliente("ID de pedido no disponible");
          return;
        }
        setLoadingCliente(true);
        setErrorCliente(null);
        const clienteData = await getClientePorPedido(pedidoVenta.id);
        setClienteCompleto(clienteData);
      } catch (error) {
        console.error("Error al obtener datos del cliente:", error);
        setErrorCliente("No se pudieron cargar los datos completos del cliente");
      } finally {
        setLoadingCliente(false);
      }
    };

    obtenerClienteDetallado();
  }, [pedidoVenta.id]);

  if (loadingPedido) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Cargando detalles del pedido...</h2>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (errorPedido) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Error</h2>
        <p>{errorPedido}</p>
        <button onClick={onClose} className={styles.closeButton}>Cerrar</button>
      </div>
    );
  }

  const pedidoMostrar = pedidoCargado || pedidoVenta;

  const formatoMoneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pedido : {pedidoMostrar.id}</h2>

      <div className={styles.details}>
        <div>
          <p>
            <strong>Fecha:</strong>{" "}
            {formatearFechaHora(pedidoMostrar)}
          </p>
          <p>
            <strong>Estado:</strong> {Estado[pedidoMostrar.estado]}
          </p>
          <p>
            <strong>Nombre y Apellido:</strong>{" "}
            {clienteCompleto
              ? `${clienteCompleto.nombre} ${clienteCompleto.apellido}`
              : "No registrado"}
          </p>
          <p>
            <strong>Teléfono:</strong>{" "}
            {clienteCompleto ? clienteCompleto.telefono : "No registrado"}
          </p>
          <p>
            <strong>Dirección:</strong>{" "}
            {pedidoMostrar.domicilio
              ? `${pedidoMostrar.domicilio.calle} ${pedidoMostrar.domicilio.numero}${pedidoMostrar.domicilio.localidad?.nombre ? `, ${pedidoMostrar.domicilio.localidad.nombre}` : ""}`
              : clienteCompleto?.domicilio
                ? `${clienteCompleto.domicilio.calle} ${clienteCompleto.domicilio.numero}${clienteCompleto.domicilio.localidad?.nombre ? `, ${clienteCompleto.domicilio.localidad.nombre}` : ""}`
                : "No registrada"}
          </p>
        </div>
        <div>
          <p>
            <strong>Forma de Entrega:</strong> {TipoEnvio[pedidoMostrar.tipoEnvio]}
          </p>
          <p>
            <strong>Forma de Pago:</strong> {FormaPago[pedidoMostrar.formaPago]}
          </p>
          <p>
            <strong>Hora estimada:</strong>{" "}
            {pedidoMostrar.horaPedido} -{" "}
            {(() => {
              const [h, m] = pedidoMostrar.horaPedido.split(":").map(Number);
              let date = new Date(pedidoMostrar.fechaPedido);
              date.setHours(h, m + 20);
              const hh = date.getHours().toString().padStart(2, "0");
              const mm = date.getMinutes().toString().padStart(2, "0");
              return `${hh}:${mm}`;
            })()}
          </p>
        </div>
      </div>

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
          {pedidoCargado?.pedidosVentaDetalle?.map((detalle, index) => (
            <tr key={index}>
              <td>
                {detalle.promocion 
                  ? (detalle.promocion.denominacion || 'Promoción #' + (detalle.promocion.id || 'Sin ID'))
                  : (detalle.articulo?.denominacion || 'Producto no disponible')}
              </td>
              <td>{detalle.cantidad}</td>
              <td>{formatoMoneda.format(detalle.subtotal / detalle.cantidad)}</td>
              <td>{formatoMoneda.format(detalle.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.summary}>
        <p>
          <strong>Sub Total:</strong> {formatoMoneda.format(pedidoVenta.pedidosVentaDetalle.reduce((acc, detalle) => acc + detalle.subtotal, 0))}
        </p>
        
        {pedidoMostrar.descuento > 0 && (
          <p>
            <strong>Descuentos:</strong> -{formatoMoneda.format((pedidoVenta.totalVenta*(pedidoVenta.descuento/100)))}
          </p>
        )}
        {(!pedidoMostrar.descuento || pedidoMostrar.descuento === 0) && (
          <p>
            <strong>Descuentos:</strong> - - -
          </p>
        )}
        
        <p className={styles.total}>
          <strong>TOTAL:</strong> {formatoMoneda.format(pedidoMostrar.totalVenta)}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;
