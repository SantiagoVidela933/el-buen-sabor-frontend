// store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArticuloVenta } from '../../models/ArticuloVenta';

interface CartItem {
  articuloManufacturado: ArticuloVenta;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ articuloManufacturado: ArticuloVenta; quantity?: number }>) => {
      const { articuloManufacturado, quantity = 1 } = action.payload;
      const existingItem = state.cartItems.find(item => item.articuloManufacturado.id === articuloManufacturado.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ articuloManufacturado, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter(item => item.articuloManufacturado.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find(item => item.articuloManufacturado.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
