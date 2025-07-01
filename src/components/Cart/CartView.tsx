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
import { getLocalidadesJSONFetch } from '../../api/localidades';

interface CartViewProps {
  onClose: () => void;
}

const CartView = ({ onClose }: CartViewProps) => {

  // obtiene items del carrito y sus funciones
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const dispatch = useDispatch();

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
  const [localidadId, setLocalidadId] = useState<number | null>(null);
  const [localidades, setLocalidades] = useState<any[]>([]);
  const [loadingLocalidades, setLoadingLocalidades] = useState(false);

  const { user, isAuthenticated } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();


  // Calcula el total
  const getTotal = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + (item.articuloVenta.precioVenta ?? 0) * item.quantity,
      0
    );

    // Aplicar descuento del 10% si es retiro en el local
    if (deliveryMethod === 'retiro') {
      return subtotal * 0.9; // Aplica el 90% del total
    }

    return subtotal; // Sin descuento
  };

  // Calcula el descuento
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.articuloVenta.precioVenta ?? 0) * item.quantity,
    0
  );
  const descuento = deliveryMethod === 'retiro' ? subtotal * 0.1 : 0; // 10% de descuento si es retiro
  const totalConDescuento = subtotal - descuento;

    // Obtener las localidades al cargar el componente
  useEffect(() => {
    const fetchLocalidades = async () => {
      setLoadingLocalidades(true);
      try {
        const response = await getLocalidadesJSONFetch();
        setLocalidades(response);
      } catch (error) {
        console.error("Error al cargar localidades:", error);
      } finally {
        setLoadingLocalidades(false);
      }
    };

    fetchLocalidades();
  }, []); 

  

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
        localidad.trim() !== null &&
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
          const cliente = await getClientesMailJSONFetch(user.email);
          setClientData(cliente);
          // Comprobar si el cliente tiene domicilio
          if (cliente && cliente.domicilio) {
            if (useDefaultAddress) {
              setCalle(cliente.domicilio.calle || '');
              setNumero(cliente.domicilio.numero?.toString() || '');
              setDepartamento(cliente.domicilio.piso || '');
              setLocalidad(cliente.domicilio.localidad?.nombre || '');
              setLocalidadId(cliente.domicilio.localidad?.id || null);
            }
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
    // Inicializa el objeto base con sus propiedades
    const pedidoDto: any = {
      fechaPedido: pedido.fechaPedido.toISOString().split("T")[0],
      horaPedido: pedido.horaPedido,
      estado: pedido.estado,
      tipoEnvio: pedido.tipoEnvio === TipoEnvio.DELIVERY ? "DELIVERY" : "TAKE_AWAY",
      formaPago: pedido.formaPago === FormaPago.MERCADO_PAGO ? "MERCADO_PAGO" : "EFECTIVO",
      sucursal: {
        id: 1
      },
      pedidosVentaDetalle: pedido.pedidosVentaDetalle.map((detalle) => {
        // Verificamos si es una promoción por la propiedad tipo="PROMOCION"
        if (detalle.articulo && detalle.articulo.tipoArticulo === 'PROMOCION') {
          return {
            cantidad: detalle.cantidad,
            promocion: {
              id: detalle.articulo.id
            }
          };
        } 
        // Si es un artículo normal
        else if (detalle.articulo) {
          return {
            cantidad: detalle.cantidad,
            articulo: {
              id: detalle.articulo.id,
              tipoArticulo: determinarTipoArticulo(detalle.articulo)
            }
          };
        } 
        // Si ya tiene un objeto promoción explícito
        else if (detalle.promocion) {
          return {
            cantidad: detalle.cantidad,
            promocion: {
              id: detalle.promocion.id
            }
          };
        }
        
        // Caso por defecto
        return {
          cantidad: detalle.cantidad
        };
      })
    };



    // Solo añadir domicilio si es necesario
    if (deliveryMethod === 'envio') {
      pedidoDto.domicilio = useDefaultAddress && clientData?.domicilio 
        ? { id: clientData.domicilio.id }
        : {
            calle: calle,
            numero: parseInt(numero) || 0,
            piso: departamento,
            codigoPostal: clientData?.domicilio?.codigoPostal || 5500,
            localidad: {
              id: localidadId || 1,
              nombre: localidad || "Desconocido"
            }
          };
    }

    // Para el backend podemos añadir el cliente, pero lo hacemos de forma explícita
    // para evitar incluirlo en la comparación con el formato esperado
    pedidoDto.cliente = {
      id: clientData?.id
    };

    return pedidoDto;
  }

  // Función para determinar el tipo de artículo
  function determinarTipoArticulo(articulo: any): string {
    // Si conocemos explícitamente el tipo
    if (articulo.tipo === 'MANUFACTURADO') {
      return "manufacturado";
    } else if (articulo.tipo === 'INSUMO') {
      return "insumo";
    }
    
    // Si tenemos una lista de IDs conocidos
    const idsManufacturados = [1, 2, 3, 27, 48]; // Añade aquí los IDs que sabes que son manufacturados
    if (idsManufacturados.includes(articulo.id)) {
      return "manufacturado";
    }
    
    // Por defecto, asumimos que es manufacturado 
    // (ya que parece ser el caso más común en tu aplicación)
    return "manufacturado";
  }

  const handleConfirmOrder = async () => {
    // Validación de autenticación
    if (!isAuthenticated || !user?.email) {
      alert("Debes iniciar sesión para realizar un pedido.");
      return;
    }
    
    // Iniciar el proceso de carga
    setLoading(true);
    
    try {
      // Obtener información actualizada del cliente
      const cliente = await getClientesMailJSONFetch(user.email);
      if (!cliente || !cliente.id) {
        throw new Error("No se pudo obtener la información del cliente");
      }
      
      const detalles = cartItems.map((item) => {
        const cantidadManu = item.quantity;
        const subtotal = (item.articuloVenta.precioVenta ?? 0) * cantidadManu;
        const subtotalCosto = subtotal;
        
        
        // Verificación exacta según cómo está marcada la promoción en CardPromocion.tsx
        // Nota que en CardPromocion.tsx usas tipo: "PROMOCION" (en mayúsculas)
        if (item.articuloVenta.tipo === 'PROMOCION') {
          return new PedidoVentaDetalle(
            cantidadManu,
            subtotal,
            subtotalCosto,
            { id: item.articuloVenta.id } as any, // promocion
            undefined,
            undefined
          );
        } else {
          return new PedidoVentaDetalle(
            cantidadManu,
            subtotal,
            subtotalCosto,
            undefined,
            undefined,
            { 
              id: item.articuloVenta.id,
              tipo: item.articuloVenta.tipo
            } as any
          );
        }
      });

      // Crear el pedido con los detalles
      const newPedido = new PedidoVenta(
        new Date(),
        new Date().toTimeString().slice(0, 8),
        Estado.PREPARACION,
        deliveryMethod === 'retiro' ? TipoEnvio.TAKE_AWAY : TipoEnvio.DELIVERY,
        deliveryMethod === 'envio' ? 150 : 0,
        paymentMethod === 'mercadoPago' ? FormaPago.MERCADO_PAGO : FormaPago.EFECTIVO,
        deliveryMethod === 'retiro' ? 0.1 : 0,
        detalles.reduce((acc, d) => acc + d.subtotalCosto, 0),
        getTotal(),
        detalles
      );

      // Domicilio
      if (deliveryMethod === 'envio') {
        if (useDefaultAddress && clientData?.domicilio) {
          newPedido.domicilio = clientData.domicilio;
        } else {
          // Asegúrate de crear un objeto Domicilio válido según tu modelo
          newPedido.domicilio = {
            id: 0,
            fechaAlta: new Date(),
            fechaModificacion: new Date(),
            fechaBaja: null,
            calle: calle,
            numero: parseInt(numero) || 0,
            piso: departamento,
            codigoPostal: clientData?.domicilio?.codigoPostal || 5500,
            localidad: {
              id: localidadId || 1,
              nombre: localidad || "Desconocido"
            }
          } as any; // Casting para evitar problemas de tipo
        }
      }
      
      // Preparar DTO para enviar al backend
      const pedidoDto = mapPedidoToDto(newPedido);

      // Enviar pedido al backend
      const pedidoCreado = await crearPedidoVenta(pedidoDto, getAccessTokenSilently);
      // Si el pago es con MercadoPago, crear preferencia
      if (paymentMethod === 'mercadoPago') {
        try {
          // Esperar un momento para asegurar que la factura se haya creado en el backend
          await new Promise(resolve => setTimeout(resolve, 500));

          // Obtener el ID del pedido
          const pedidoId = pedidoCreado.id;

          if (!pedidoId) {
            throw new Error("ID de pedido no disponible");
          }

          // Crear pago en MercadoPago
          const mercadoPagoData = await crearPagoMercadoPago(pedidoId, getAccessTokenSilently);
          setPreferenceId(mercadoPagoData.preferenceId);
        } catch (mpError) {
          console.error("Error al preparar pago con MercadoPago:", mpError);
          alert("Error al preparar el pago con MercadoPago. Por favor, inténtalo de nuevo.");
          return;
        }
      }
      
      // Limpiar carrito y confirmar pedido
      dispatch(clearCart());
      setConfirmed(true);
    } catch (error) {
      console.error("Error al crear pedido:", error);
      alert("Ocurrió un error al crear el pedido. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Handler para cuando se selecciona una localidad del dropdown
  const handleLocalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const selectedLocalidad = localidades.find(loc => loc.id === selectedId);
    
    if (selectedLocalidad) {
      setLocalidadId(selectedId);
      setLocalidad(selectedLocalidad.nombre);
    } else {
      setLocalidadId(null);
      setLocalidad('');
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
                  key={item.articuloVenta.id}
                  articuloVenta={item.articuloVenta}
                  quantity={item.quantity}
                  removeFromCart={(productId) => dispatch(removeFromCart(productId))}
                  updateQuantity={(productId, quantity) => dispatch(updateQuantity({ productId, quantity }))}
                />
              ))
            )}
          </div>

          <div className={styles.cart_resumen}>
            <div className={styles.resumen_amount}>
              <p>Subtotal</p>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {descuento > 0 && (
              <div className={styles.resumen_desc}>
                <p>Descuento (10%)</p>
                <span>-${descuento.toFixed(2)}</span>
              </div>
            )}

            <div className={styles.resumen_total}>
              <p>Total</p>
              <span>${totalConDescuento.toFixed(2)}</span>
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
                  disabled={confirmed}
                  onChange={() => {
                    setDeliveryMethod('retiro');
                    setPaymentMethod('');
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
                  disabled={confirmed}
                  onChange={() => {
                    setDeliveryMethod('envio');
                    setPaymentMethod('');
                    
                    // Si hay datos de cliente disponibles y tiene domicilio, precarga los valores
                    if (clientData?.domicilio && useDefaultAddress) {
                      setCalle(clientData.domicilio.calle || '');
                      setNumero(clientData.domicilio.numero?.toString() || '');
                      setDepartamento(clientData.domicilio.piso || '');
                      setLocalidad(clientData.domicilio.localidad?.nombre || '');
                      setLocalidadId(clientData.domicilio.localidad?.id || null);
                    } else {
                      // Limpiar campos
                      setCalle('');
                      setNumero('');
                      setDepartamento('');
                      setLocalidad('');
                      setLocalidadId(null);
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
                    disabled={confirmed}
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
                      disabled={confirmed}
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
                        disabled={confirmed}
                        onChange={() => setUseDefaultAddress(true)}
                      />
                      Usar mi dirección guardada: {clientData.domicilio.calle} {clientData.domicilio.numero}
                      {clientData.domicilio.piso && `, Piso/Dpto: ${clientData.domicilio.piso}`}
                      {clientData.domicilio.localidad && `, ${clientData.domicilio.localidad.nombre}`}
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={!useDefaultAddress}
                        disabled={confirmed}
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
                    disabled={confirmed}
                    className={styles.inputField}
                  />
                  <input
                    type="text"
                    placeholder="Número"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    disabled={confirmed}
                    className={styles.inputField}
                  />
                  <input
                    type="text"
                    placeholder="Piso/Departamento (opcional)"
                    value={departamento}
                    onChange={(e) => setDepartamento(e.target.value)}
                    disabled={confirmed}
                    className={styles.inputField}
                  />
                  <select 
                    value={localidadId || ''}
                    onChange={handleLocalidadChange}
                    disabled={confirmed || loadingLocalidades}
                    className={styles.inputField}
                  >
                    <option value="">Seleccione una localidad</option>
                    {localidades.map(localidad => (
                      <option key={localidad.id} value={localidad.id}>
                        {localidad.nombre}
                      </option>
                    ))}
                  </select>
                  {loadingLocalidades && <p className={styles.loadingText}>Cargando localidades...</p>}

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
                        disabled={confirmed}
                      />
                    Mercado Pago
                  </label>
                </div>
                <p className={styles.warningText}>* Solo se permite Mercado Pago para envío</p>
              </div>
            )}

            {/* BOTÓN CONFIRMAR dentro del formulario */}
            {!confirmed && isFormValid() && (
              <button type="button" onClick={handleConfirmOrder} className={styles.confirmButton} disabled={confirmed}>
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
            </div>
          )}
        </div>
      </div>

      <button onClick={onClose} className={styles.backToMenuButton}>Volver al menú</button>
    </div>
  );
};

export default CartView;