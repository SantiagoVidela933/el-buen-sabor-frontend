import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PedidoVenta } from "../../models/PedidoVenta";

interface PedidoVentaState {
  pedidos: PedidoVenta[];
}

const initialState: PedidoVentaState = {
  pedidos: [],
};

const pedidoVentaSlice = createSlice({
  name: "pedidoVenta",
  initialState,
  reducers: {
    setPedidos: (state, action: PayloadAction<PedidoVenta[]>) => {
      state.pedidos = action.payload;
    },
    addPedido: (state, action: PayloadAction<PedidoVenta>) => {
      state.pedidos.unshift(action.payload);
    },
    clearPedidos: (state) => {
      state.pedidos = [];
    },
  },
});

export const { setPedidos, addPedido, clearPedidos } = pedidoVentaSlice.actions;
export default pedidoVentaSlice.reducer;
