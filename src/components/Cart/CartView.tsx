import { useState } from 'react';
import styles from './CartView.module.css';
import ProductCart from '../Products/ProductCart/ProductCart';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  clearCart,
  removeFromCart,
  updateQuantity
} from '../../redux/slices/cartSlice';
import { Estado } from '../../models/enums/Estado';
import { TipoEnvio } from '../../models/enums/TipoEnvio';
import { FormaPago } from '../../models/enums/FormaPago';
import { PedidoVenta } from '../../models/PedidoVenta';
import { PedidoVentaDetalle } from '../../models/PedidoVentaDetalle';
import { crearPedidoVenta } from '../../api/pedidoVenta';
import { useAuth0 } from '@auth0/auth0-react';
import { getClientesMailJSONFetch } from '../../api/cliente';
import CheckoutMP from './MercadoPago/CheckoutMP';
import { crearPagoMercadoPago } from '../../api/mercadoPago';

interface CartViewProps {
  onClose: () => void;
}

const CartView = ({ onClose }: CartViewProps) => {

  // obtiene items del carrito y sus funciones
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const dispatch = useDispatch();
  
  // Calcula el total
  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.articuloManufacturado.precioVenta * item.quantity,
      0
    );
  };
  
  const [deliveryMethod, setDeliveryMethod] = useState<'retiro' | 'envio' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // datos necesarios si elige envio
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [departamento, setDepartamento] = useState('');

  const { user, isAuthenticated } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();

  const togglePaymentMethod = (method: string) => {
    setPaymentMethod((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const isFormValid = () => {
    // si es retiro, que haya al menos 1 metodo de pago
    if (deliveryMethod === 'retiro') {
      return paymentMethod.length > 0;
    }
    // si es envio, que los campos esten completos y pago con MP
    if (deliveryMethod === 'envio') {
      return (
        telefono.trim() !== '' &&
        direccion.trim() !== '' &&
        departamento.trim() !== '' &&
        paymentMethod.includes('mercadoPago')
      );
    }
    return false;
  };

  function mapPedidoToDto(pedido: PedidoVenta): any {
    return {
      fechaPedido: pedido.fechaPedido.toISOString().split("T")[0],
      horaPedido: pedido.horaPedido,
      estado: pedido.estado,
      tipoEnvio: pedido.tipoEnvio,
      gastoEnvio: pedido.gastoEnvio,
      formaPago: pedido.formaPago,
      descuento: pedido.descuento,
      totalCosto: pedido.totalCosto,
      totalVenta: pedido.totalVenta,
      pedidosVentaDetalle: pedido.pedidosVentaDetalle.map((detalle) => ({
        cantidad: detalle.cantidad,
        subtotal: detalle.subtotal,
        subtotalCosto: detalle.subtotalCosto,
        articulo: {
          id: detalle.articulo!.id,
          tipoArticulo: (detalle.articulo! as any).tipoArticulo || "manufacturado",
        },
      })),
    };
  }

  const handleConfirmOrder = async () => {
    if (!isAuthenticated || !user?.email) {
      alert("Debes iniciar sesión para realizar un pedido.");
      return;
    }
    setLoading(true);
    const detalles: PedidoVentaDetalle[] = [];

    cartItems.forEach((item) => {
      const cantidadManu = item.quantity;

      detalles.push(
        new PedidoVentaDetalle(
          cantidadManu,
          item.articuloManufacturado.precioVenta * cantidadManu,
          item.articuloManufacturado.precioCosto * cantidadManu,
          undefined,
          undefined,
          { id: item.articuloManufacturado.id, tipoArticulo: "manufacturado" } as any
        )
      );

      item.articuloManufacturado.detalles.forEach((detalleInsumo) => {
        const insumo = detalleInsumo.articuloInsumo;
        const cantidadInsumo = detalleInsumo.cantidad * cantidadManu;

        detalles.push(
          new PedidoVentaDetalle(
            cantidadInsumo,
            0,
            0,
            undefined,
            undefined,
            { id: insumo.id, tipoArticulo: "insumo" } as any
          )
        );
      });
    });

    const newPedido = new PedidoVenta(
      new Date(),
      new Date().toTimeString().slice(0, 8),
      Estado.PREPARACION,
      deliveryMethod === 'retiro' ? TipoEnvio.TAKE_AWAY : TipoEnvio.DELIVERY,
      deliveryMethod === 'envio' ? 150 : 0,
      paymentMethod.includes('mercadoPago') ? FormaPago.MERCADO_PAGO : FormaPago.EFECTIVO,
      0,
      detalles.reduce((acc, d) => acc + d.subtotalCosto, 0),
      getTotal(),
      detalles
    );

    try {
      const cliente = await getClientesMailJSONFetch(user.email);

      newPedido.cliente = cliente;

      const pedidoDto = mapPedidoToDto(newPedido);

      const pedidoCreado = await crearPedidoVenta(pedidoDto, getAccessTokenSilently);
      console.log("Pedido creado en backend:", pedidoCreado);

      //MercadoPago
      if (paymentMethod.includes('mercadoPago')) {
        try {
          // Wait a moment to ensure the factura is created in the backend
          await new Promise(resolve => setTimeout(resolve, 500));

          // Get the pedidoId from the order
          const pedidoId = pedidoCreado.id;
          
          if (!pedidoId) {
            console.error("No se pudo obtener el ID del pedido");
            return;
          }
          
          // Use the crearPagoMercadoPago function properly
          const mercadoPagoData = await crearPagoMercadoPago(pedidoId, getAccessTokenSilently);
          
          // Set the preferenceId from the response
          setPreferenceId(mercadoPagoData.preferenceId);
          console.log("Preference ID obtenido:", mercadoPagoData.preferenceId);
          
        } catch (mpError) {
          console.error("Error al preparar pago con MercadoPago:", mpError);
        } finally {
          setLoading(false);
        }
      }
      dispatch(clearCart());
      setConfirmed(true);
    } catch (error) {
      console.error("Error al crear pedido:", error);
      alert("Ocurrió un error al crear el pedido.");
    }
  };

  return (
    <div className={styles.cartView_wrapper}>
      <div className={styles.cartView_title}>
        <h3>CARRITO DE COMPRAS</h3>
      </div>
      <div className={styles.cartView_cart}>
        <div className={styles.cart_products}>
          {/* Lista de Productos */}
          {cartItems.length === 0 ? (
            <p>No hay productos en el carrito</p>
          ) : (
            cartItems.map((item) => (
              <ProductCart
                key={item.articuloManufacturado.id}
                articuloManufacturado={item.articuloManufacturado}
                quantity={item.quantity}
                removeFromCart={(productId) => dispatch(removeFromCart(productId))}
                updateQuantity={(productId, quantity) => dispatch(updateQuantity({ productId, quantity }))}
              />

            ))
          )}
        </div>

        <div className={styles.cart_resumen}>
          <div className={styles.resumen_amount}>
            <p>{cartItems.length} artículo(s)</p>
            <span>${getTotal()}</span>
          </div>
          <div className={styles.resumen_desc}>
            <p>Descuento</p>
            <span>---</span>
          </div>
          <div className={styles.resumen_total}>
            <p>Total:</p>
            <span>${getTotal()}</span>
          </div>
        </div>

        <div className={styles.divLine}></div>

        <form className={styles.resumen_form}>
          <p>Seleccionar:</p>
          <label>
            <input
              type="checkbox"
              checked={deliveryMethod === 'retiro'}
              onChange={() => {
                setDeliveryMethod('retiro');
                setPaymentMethod([]);
                setTelefono('');
                setDireccion('');
                setDepartamento('');
              }}
            />
            Retiro por el local
          </label>
          <label>
            <input
              type="checkbox"
              checked={deliveryMethod === 'envio'}
              onChange={() => {
                setDeliveryMethod('envio');
                setPaymentMethod([]);
                setTelefono('');
                setDireccion('');
                setDepartamento('');
              }}
            />
            Envío a domicilio
          </label>

          {/* RETIRO */}
          {deliveryMethod === 'retiro' && (
            <div className={styles.form_section}>
              <p>Tipo de pago:</p>
              <label>
                <input
                  type="checkbox"
                  checked={paymentMethod.includes('efectivo')}
                  onChange={() => togglePaymentMethod('efectivo')}
                />
                Efectivo
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={paymentMethod.includes('mercadoPago')}
                  onChange={() => togglePaymentMethod('mercadoPago')}
                />
                Mercado Pago
              </label>
            </div>
          )}

          {/* ENVÍO */}
          {deliveryMethod === 'envio' && (
            <div className={styles.form_section}>
              <input
                type="text"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Departamento"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                className={styles.inputField}
              />

              <p>Forma de pago:</p>
              <label>
                <input
                  type="checkbox"
                  checked={paymentMethod.includes('mercadoPago')}
                  onChange={() => togglePaymentMethod('mercadoPago')}
                />
                Mercado Pago
              </label>
              <p className={styles.warningText}>* Solo se permite Mercado Pago para envío</p>
            </div>
          )}
        </form>

        {/* BOTÓN CONFIRMAR */}
        {!confirmed && isFormValid() && (
          <button onClick={handleConfirmOrder} className={styles.confirmButton}>
            Confirmar Pedido
          </button>
        )}

        {/* BOTONES POST-CONFIRMACIÓN */}
        {confirmed && (
          <div className={styles.postConfirm}>
            {/* MercadoPago button - only show if MercadoPago was selected */}
            {paymentMethod.includes('mercadoPago') && (
              <div className={styles.mercadoPagoContainer}>
                <p className={styles.paymentMessage}>
                  Tu pedido ha sido creado. Para completar la compra, haz clic en el botón de pago.
                </p>
                
                {loading ? (
                  <p>Preparando opciones de pago...</p>
                ) : preferenceId ? (
                  <CheckoutMP 
                    idPreferencia={preferenceId}
                    mostrar={true} 
                  />
                ) : (
                  <p className={styles.errorMessage}>
                    Error al obtener opciones de pago. Contacta con soporte.
                  </p>
                )}
              </div>
            )}
            
            {/* Show message for cash payments */}
            {paymentMethod.includes('efectivo') && (
              <p className={styles.paymentMessage}>
                Tu pedido ha sido confirmado y será preparado para retirar en el local.
              </p>
            )}
            
            <button className={styles.invoiceButton}>Ver Factura</button>
            <button className={styles.timeButton}>Hora estimada 21.30 - 22.00</button>
          </div>
        )}
      </div>

      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default CartView;
