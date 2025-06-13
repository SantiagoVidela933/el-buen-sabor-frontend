import { useState, useEffect } from 'react';
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
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  //Variables para el uso de la dirección
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [clientData, setClientData] = useState<any>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // datos necesarios si elige envio
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [localidad, setLocalidad] = useState('');

  const { user, isAuthenticated } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();

  const isFormValid = () => {
    // si es retiro, que haya al menos 1 metodo de pago
    if (deliveryMethod === 'retiro') {
      return paymentMethod != '';
    }
    // si es envio, que los campos esten completos y pago con MP
    if (deliveryMethod === 'envio') {
      // Si usa dirección predeterminada, solo verificar método de pago
      if (useDefaultAddress && clientData?.domicilios?.length > 0) {
        return paymentMethod ==='mercadoPago';
      } 
      // Si usa dirección nueva, verificar que todos los campos estén completos
      return (
        calle.trim() !== '' &&
        numero.trim() !== '' &&
        localidad.trim() !== '' &&
        paymentMethod === 'mercadoPago'
      );
    }
    return false;
  };

  useEffect(() => {
    const fetchClientData = async () => {
      if (isAuthenticated && user?.email) {
        setLoadingAddress(true);
        try {
          console.log("Obteniendo datos para email:", user.email);
          const cliente = await getClientesMailJSONFetch(user.email);
          console.log("Datos obtenidos del cliente:", cliente);
        
          setClientData(cliente);
          // Comprobar si el cliente tiene domicilio
          if (cliente && cliente.domicilio) {
            if (useDefaultAddress) {
              setCalle(cliente.domicilio.calle || '');
              setNumero(cliente.domicilio.numero?.toString() || '');
              setDepartamento(cliente.domicilio.piso || '');
              setLocalidad(cliente.domicilio.localidad?.nombre || '');
            }
          } else {
            console.log("El cliente no tiene domicilio registrado");
          }
        } catch (error) {
          console.error("Error al obtener datos del cliente:", error);
        } finally {
          setLoadingAddress(false);
        }
      }
    };
    
    fetchClientData();
  }, [isAuthenticated, user?.email, useDefaultAddress]);

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
      // Agregamos el domicilio cuando es necesario
      domicilio: deliveryMethod === 'envio' ? 
      useDefaultAddress && clientData?.domicilio ? 
        clientData.domicilio : 
        {
          calle: calle,
          numero: parseInt(numero) || 0,
          piso: departamento,
          localidad: {
            id: 1, // ID por defecto para localidad
            nombre: localidad || "Desconocido"
          }
        } 
      : null
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
    
    //Domicilio
    let domicilioData = null;
    if (deliveryMethod === 'envio') {
      if (useDefaultAddress && clientData?.domicilio) {
        // Usar domicilio existente del cliente
        domicilioData = clientData.domicilio;
      } else {
        // Crear nuevo domicilio con los datos ingresados
        domicilioData = {
          calle: calle,
          numero: parseInt(numero) || 0,
          piso: departamento,
          codigoPostal: clientData?.domicilio?.codigoPostal || 5500,
          localidad: {
            id: 0,  // Puedes necesitar ajustar esto según tu lógica de backend
            nombre: localidad || "Desconocido"
          }
        };
      }
    }

    const newPedido = new PedidoVenta(
      new Date(),
      new Date().toTimeString().slice(0, 8),
      Estado.PREPARACION,
      deliveryMethod === 'retiro' ? TipoEnvio.TAKE_AWAY : TipoEnvio.DELIVERY,
      deliveryMethod === 'envio' ? 150 : 0,
      paymentMethod ==='mercadoPago' ? FormaPago.MERCADO_PAGO : FormaPago.EFECTIVO,
      0,
      detalles.reduce((acc, d) => acc + d.subtotalCosto, 0),
      getTotal(),
      detalles
    );

    

    try {
      const cliente = await getClientesMailJSONFetch(user.email);

      newPedido.cliente = cliente;
      // Añadir información del domicilio al pedido
      if (domicilioData) {
        newPedido.domicilio = domicilioData;
      }

      const pedidoDto = mapPedidoToDto(newPedido);

      const pedidoCreado = await crearPedidoVenta(pedidoDto, getAccessTokenSilently);
      console.log("Pedido creado en backend:", pedidoCreado);

      //MercadoPago
      if (paymentMethod ==='mercadoPago') {
        try {
          console.log("Creando preferencia de MercadoPago para pedido ID:", pedidoCreado.id);

          // Wait a moment to ensure the factura is created in the backend
          await new Promise(resolve => setTimeout(resolve, 500));

          // Get the pedidoId from the order
          const pedidoId = pedidoCreado.id;

          if (!pedidoId) {
            console.error("No se pudo obtener el ID del pedido");
            throw new Error("ID de pedido no disponible");
          }

          // Use the crearPagoMercadoPago function properly
          const mercadoPagoData = await crearPagoMercadoPago(pedidoId, getAccessTokenSilently);

          // Set the preferenceId from the response
          setPreferenceId(mercadoPagoData.preferenceId);
          console.log("Preference ID obtenido:", mercadoPagoData.preferenceId);

        } catch (mpError) {
          console.error("Error al preparar pago con MercadoPago:", mpError);
          alert("Error al preparar el pago con MercadoPago. Por favor, inténtalo de nuevo.");
          return;
        }
      }
      dispatch(clearCart());
      setConfirmed(true);
    } catch (error) {
      console.error("Error al crear pedido:", error);
      alert("Ocurrió un error al crear el pedido.");
    }finally{
      setLoading(false);
      console.log("Estado de carga finalizado. Loading:", false);

    }
  };

  return (
    <div className={styles.cartView_wrapper}>
      <div className={styles.cartView_title}>
        <h3>CARRITO DE COMPRAS</h3>
      </div>

      <div className={styles.cartView_mainContent}>
        <div className={styles.cartView_leftColumn}>
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
        </div>

        <div className={styles.cartView_rightColumn}>
          <form className={styles.resumen_form}>
            <p className={styles.formTitle}>Seleccionar:</p>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="deliveryMethod"
                  checked={deliveryMethod === 'retiro'}
                  onChange={() => {
                    setDeliveryMethod('retiro');
                    setPaymentMethod('');
                    // Limpiar campos de domicilio con los nombres actualizados
                    setCalle('');
                    setNumero('');
                    setDepartamento('');
                    setLocalidad('');
                  }}
                />
                Retiro por el local
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="deliveryMethod"
                  checked={deliveryMethod === 'envio'}
                  onChange={() => {
                    setDeliveryMethod('envio');
                    setPaymentMethod('');
                    
                    // Si hay datos de cliente disponibles y tiene domicilio, precarga los valores
                    if (clientData?.domicilio && useDefaultAddress) {
                      setCalle(clientData.domicilio.calle || '');
                      setNumero(clientData.domicilio.numero?.toString() || '');
                      setDepartamento(clientData.domicilio.piso || '');
                      setLocalidad(clientData.domicilio.localidad?.nombre || '');
                    } else {
                      // Limpiar campos
                      setCalle('');
                      setNumero('');
                      setDepartamento('');
                      setLocalidad('');
                    }
                  }}
                />
                Envío a domicilio
              </label>
            </div>

            {/* RETIRO POR LOCAL */}
            {deliveryMethod === 'retiro' && (
              <div className={styles.form_section}>
                <p className={styles.sectionTitle}>Tipo de pago:</p>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="paymentMethod"
                    value="efectivo"
                    checked={paymentMethod === 'efectivo'}
                    onChange={() => setPaymentMethod('efectivo')}
                  />
                    Efectivo
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="paymentMethod"
                      value="mercadoPago"
                      checked={paymentMethod === 'mercadoPago'}
                      onChange={() => setPaymentMethod('mercadoPago')}
                    />
                    Mercado Pago
                  </label>
                </div>
              </div>
            )}

            {/* ENVÍO A DOMICILIO */}
            {deliveryMethod === 'envio' && (
              <div className={styles.form_section}>
                <p className={styles.sectionTitle}>Datos de envío:</p>
                
                {loadingAddress ? (
                  <p>Cargando datos de dirección...</p>
                ) : clientData?.domicilio? (
                  <div className={styles.addressOptions}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={useDefaultAddress}
                        onChange={() => setUseDefaultAddress(true)}
                      />
                      Usar mi dirección guardada: {clientData.domicilio.calle} {clientData.domicilio.numero}
                        {clientData.domicilio.piso && `, Piso/Dpto: ${clientData.domicilio.piso}`}
                      </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={!useDefaultAddress}
                        onChange={() => setUseDefaultAddress(false)}
                      />
                      Usar otra dirección
                    </label>
                  </div>
                ) : null}
                
                {(!clientData?.domicilio || !useDefaultAddress) && (
                <div className={styles.newAddressForm}>
                  <input
                    type="text"
                    placeholder="Calle"
                    value={calle}
                    onChange={(e) => setCalle(e.target.value)}
                    className={styles.inputField}
                  />
                  <input
                    type="text"
                    placeholder="Número"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className={styles.inputField}
                  />
                  <input
                    type="text"
                    placeholder="Piso/Departamento (opcional)"
                    value={departamento}
                    onChange={(e) => setDepartamento(e.target.value)}
                    className={styles.inputField}
                  />
                  <input
                    type="text"
                    placeholder="Localidad"
                    value={localidad}
                    onChange={(e) => setLocalidad(e.target.value)}
                    className={styles.inputField}
                  />
                </div>
              )}
                
                <p className={styles.sectionTitle}>Forma de pago:</p>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="paymentMethod"
                        value="mercadoPago"
                        checked={paymentMethod === 'mercadoPago'}
                        onChange={() => setPaymentMethod('mercadoPago')}
                      />
                    Mercado Pago
                  </label>
                </div>
                <p className={styles.warningText}>* Solo se permite Mercado Pago para envío</p>
              </div>
            )}

            {/* BOTÓN CONFIRMAR dentro del formulario */}
            {!confirmed && isFormValid() && (
              <button type="button" onClick={handleConfirmOrder} className={styles.confirmButton}>
                Confirmar pedido
              </button>
            )}
          </form>

          {/* Sacamos los BOTONES POST-CONFIRMACIÓN FUERA del formulario */}
          {confirmed && (
            <div className={styles.postConfirm}>
              {paymentMethod==='mercadoPago' && (
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

              {paymentMethod ==='efectivo' && (
                <p className={styles.paymentMessage}>
                  Tu pedido ha sido confirmado y será preparado para retirar en el local.
                </p>
              )}

              <button className={styles.invoiceButton}>Ver Factura</button>
              <button className={styles.timeButton}>Hora estimada 21.30 - 22.00</button>
            </div>
          )}
        </div>
      </div>

      <button onClick={onClose} className={styles.backToMenuButton}>Volver al menú</button>
    </div>
  );
};

export default CartView;