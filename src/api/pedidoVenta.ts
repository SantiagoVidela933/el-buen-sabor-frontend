import { PedidoVenta } from "../models/PedidoVenta";

// GET PedidoVenta
export const getPedidosVentas = async () => {
  const response = await fetch("http://localhost:8080/api/v1/pedidoVenta", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener los pedidos: ${errorText}`);
  }

  return await response.json();
};


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

