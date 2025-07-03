// store/cartSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ArticuloVenta } from '../../models/ArticuloVenta';
import { getSucursal } from '../../api/sucursal';
import Swal from 'sweetalert2';

interface CartItem {
  articuloVenta: ArticuloVenta;
  quantity: number;
}

// Interfaz para el estado del carrito
interface CartState {
  cartItems: CartItem[];
  isStoreOpen: boolean;
  storeHours: {
    opening: string;
    closing: string;
  }
};

// Estado inicial
const initialState: CartState = {
  cartItems: [],
  isStoreOpen: true, 
  storeHours: {
    opening: '09:00',
    closing: '22:00'
  }
};

// Verificar si la tienda está abierta
export const checkStoreStatus = createAsyncThunk(
  'cart/checkStoreStatus',
  async () => {
    try {
      const sucursal = await getSucursal();
      const opening = sucursal.horaApertura;
      const closing = sucursal.horaCierre;
      
      // Obtener hora actual
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      
      // Convertir a minutos para comparación
      const openingMinutes = parseInt(opening.split(':')[0]) * 60 + parseInt(opening.split(':')[1]);
      const closingMinutes = parseInt(closing.split(':')[0]) * 60 + parseInt(closing.split(':')[1]);
      const currentMinutes = parseInt(currentHour) * 60 + parseInt(currentMinute);
      
      // Determinar si está abierto
      const isOpen = currentMinutes >= openingMinutes && currentMinutes < closingMinutes;
      
      return {
        isStoreOpen: isOpen,
        storeHours: { opening, closing }
      };
    } catch (error) {
      console.error('Error al verificar horario de la tienda:', error);
      return {
        isStoreOpen: true,
        storeHours: { opening: '09:00', closing: '22:00' }
      };
    }
  }
);

// Añadir al carrito con verificación de horario
export const addToCartIfStoreOpen = createAsyncThunk(
  'cart/addToCartIfStoreOpen',
  async (payload: { articuloVenta: ArticuloVenta; quantity?: number }, { getState, dispatch }) => {
    const state: any = getState();
    
    let isStoreOpen = state.cart.isStoreOpen;
    let storeHours = state.cart.storeHours;
    
    if (isStoreOpen === undefined) {
      const storeStatus = await dispatch(checkStoreStatus()).unwrap();
      isStoreOpen = storeStatus.isStoreOpen;
      storeHours = storeStatus.storeHours;
    }
    
    if (isStoreOpen) {
      return { payload, success: true };
    } else {
      await Swal.fire({
        title: 'Tienda cerrada',
        text: `Lo sentimos, nuestra tienda está cerrada en este momento. Nuestro horario de atención es de ${storeHours.opening} a ${storeHours.closing}.`,
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      
      return { payload: null, success: false };
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ articuloVenta: ArticuloVenta; quantity?: number }>) => {
      const { articuloVenta, quantity = 1 } = action.payload;
      const existingItem = state.cartItems.find(item => item.articuloVenta.id === articuloVenta.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ articuloVenta, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter(item => item.articuloVenta.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find(item => item.articuloVenta.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
    updateStoreStatus: (state, action: PayloadAction<{ isOpen: boolean, hours: { opening: string, closing: string } }>) => {
      state.isStoreOpen = action.payload.isOpen;
      state.storeHours = action.payload.hours;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkStoreStatus.fulfilled, (state, action) => {
        state.isStoreOpen = action.payload.isStoreOpen;
        state.storeHours = action.payload.storeHours;
      })
      .addCase(addToCartIfStoreOpen.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.payload) {
          const { articuloVenta, quantity = 1 } = action.payload.payload;
          const existingItem = state.cartItems.find(item => item.articuloVenta.id === articuloVenta.id);
          
          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            state.cartItems.push({ articuloVenta, quantity });
          }
        }
      }
    );
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, updateStoreStatus } = cartSlice.actions;

export default cartSlice.reducer;
