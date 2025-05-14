import { createContext, useState, ReactNode } from 'react';
import { Product } from '../models/Products/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[]; // array de productos agregados
  addToCart: (product: Product, quantity: number) => void; // agrega un producto con una cantidad especifica
  removeFromCart: (productId: number) => void; // elimina producto del carrito
  updateQuantity: (productId: number, quantity: number) => void; // modifica la cantidad de un producto
  clearCart: () => void; // vacia el carrito por completo
  getTotal: () => number; // calcula el total del carrito
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider que envolverá ClientLayout
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingProduct = prev.find((item) => item.product.id === product.id);
      if (existingProduct) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
