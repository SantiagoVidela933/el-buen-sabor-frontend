import { configureStore } from '@reduxjs/toolkit';
import articuloManufacturadoReducer from './slices/articuloManufacturadoSlice';
import cartReducer from './slices/cartSlice';
import pedidoVentaReducer from './slices/pedidoVentaSlice';

// contenedor global donde se guarda todo el estado de Redux
export const store = configureStore({
  reducer: {
    articuloManufacturado: articuloManufacturadoReducer,
    cart: cartReducer,
    pedidoVenta: pedidoVentaReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// definir tipos globales
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
