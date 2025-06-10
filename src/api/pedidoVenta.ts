import { PedidoVenta } from "../models/PedidoVenta";

// POST PedidoVenta
export const crearPedidoVenta = async (pedido: PedidoVenta) => {
  const response = await fetch("http://localhost:8080/api/v1/pedidoVenta/Create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(pedido)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear el pedido: ${errorText}`);
  }

  return await response.json();
};

