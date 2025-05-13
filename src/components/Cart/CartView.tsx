import { useState } from 'react';
import styles from './CartView.module.css';
import ProductCart from '../Products/ProductCart/ProductCart';
import { useCart } from '../../hooks/useCart';
import { Order } from '../../models/Order';
import { useOrder } from '../../hooks/useOrder';

interface CartViewProps {
  onClose: () => void;
}

const CartView = ({ onClose }: CartViewProps) => {

  // obtiene items del carrito y sus funciones
  const { cartItems, clearCart, removeFromCart, updateQuantity, getTotal } = useCart(); 

  const { addOrder } = useOrder();

  const [deliveryMethod, setDeliveryMethod] = useState<'retiro' | 'envio' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  // datos necesarios si elige envio
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [departamento, setDepartamento] = useState('');

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

const handleConfirmOrder = () => {
  const newOrder = new Order(
    Date.now(), // id temporal
    new Date().toISOString(),
    getTotal(),
    "En preparación",
    paymentMethod.length > 0
  );

  addOrder(newOrder); // guarda contexto
  clearCart();         // limpia carrito
  setConfirmed(true);  // cambia estado local
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
                key={item.product.id}
                product={item.product}
                quantity={item.quantity}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
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
