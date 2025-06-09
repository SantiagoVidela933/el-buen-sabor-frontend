import { useSelector, useDispatch } from "react-redux";
import { PedidoVenta } from "../models/PedidoVenta";
import {
  setPedidos,
  addPedido,
  clearPedidos,
} from "../redux/slices/pedidoVentaSlice";
import { AppDispatch, RootState } from "../redux/store";

export const usePedidoVenta = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pedidos = useSelector((state: RootState) => state.pedidoVenta.pedidos);

  const cargarPedidos = (nuevosPedidos: PedidoVenta[]) => {
    dispatch(setPedidos(nuevosPedidos));
  };

  const agregarPedido = (pedido: PedidoVenta) => {
    dispatch(addPedido(pedido));
  };

  const limpiarPedidos = () => {
    dispatch(clearPedidos());
  };

  return {
    pedidos,
    cargarPedidos,
    agregarPedido,
    limpiarPedidos,
  };
};
