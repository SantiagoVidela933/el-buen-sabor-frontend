import { createSlice } from '@reduxjs/toolkit';
import { ArticuloManufacturado } from '../../models/ArticuloManufacturado';
import { AppDispatch } from '../store';
import { getAllArticulosManufacturados } from '../../api/articuloManufacturado';

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
    setArticulosManufacturados: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setArticulosManufacturados, setLoading, setError  } = articuloManufacturadoSlice.actions;
export default articuloManufacturadoSlice.reducer;

export const fetchArticulosManufacturados = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const articulosManufacturados = await getAllArticulosManufacturados();
    dispatch(setArticulosManufacturados(articulosManufacturados));
  } catch (error) {
    dispatch(setError('Error al cargar artículos manufacturados'));
  } finally {
    dispatch(setLoading(false));
  }
};
