import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArticuloManufacturado } from '../../models/ArticuloManufacturado';

interface ArticuloManufacturadoState {
  items: ArticuloManufacturado[];
  loading: boolean;
  error: string | null;
}

const initialState: ArticuloManufacturadoState = {
  items: [],
  loading: false,
  error: null,
};

const articuloManufacturadoSlice = createSlice({
  name: 'articuloManufacturado',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess(state, action: PayloadAction<ArticuloManufacturado[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addArticulo(state, action: PayloadAction<ArticuloManufacturado>) {
      state.items.push(action.payload);
    },
    updateArticulo(state, action: PayloadAction<ArticuloManufacturado>) {
      const index = state.items.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeArticulo(state, action: PayloadAction<number>) {
      state.items = state.items.filter(a => a.id !== action.payload);
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  addArticulo,
  updateArticulo,
  removeArticulo,
} = articuloManufacturadoSlice.actions;

export default articuloManufacturadoSlice.reducer;
