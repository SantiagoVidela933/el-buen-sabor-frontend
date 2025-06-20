import { Estado } from "../models/enums/Estado";
import { PedidoVenta } from "../models/PedidoVenta";
import type { GetTokenSilentlyOptions } from '@auth0/auth0-react';

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

// GET PedidoVenta para Cliente
export const getMisPedidosVenta = async (
  getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>
): Promise<PedidoVenta[]> => {
  try {
    const token = await getAccessTokenSilently();

    const response = await fetch("http://localhost:8080/api/v1/pedidoVenta/mis-pedidos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener los pedidos: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error general al obtener pedidos: ${error}`);
  }
};

// GET PedidoVenta por idCliente y fechas
export const getPedidosVentasPorCliente = async (idCliente: number, fechaInicio: string, fechaFin: string) => {
  // Construir la URL con el nuevo endpoint
  const url = new URL(`http://localhost:8080/api/v1/pedidoVenta/pedidos/cliente/${idCliente}/fechas`);
  
  // Agregar parámetros de consulta (fechas)
  url.searchParams.append('desde', fechaInicio);
  url.searchParams.append('hasta', fechaFin);

  console.log("URL de la solicitud:", url.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener los pedidos del cliente: ${errorText}`);
  }

  return await response.json();
};

// GET PedidoVenta Delivery
export const getPedidosVentasDelivery = async () => {
  const response = await fetch("http://localhost:8080/api/v1/pedidoVenta/delivery", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener los pedidos del delivery: ${errorText}`);
  }

  return await response.json();
};

// GET PedidoVenta Cocinero
export const getPedidosVentasCocinero = async () => {
  const response = await fetch("http://localhost:8080/api/v1/pedidoVenta/cocinero", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener los pedidos del cocinero: ${errorText}`);
  }

  return await response.json();
};

// POST PedidoVenta
export const crearPedidoVenta = async (
  pedido: PedidoVenta, 
  getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>
) => {
  const token = await getAccessTokenSilently({
    audience: 'https://apiSabor',
    scope: 'openid profile email',
  } as any);
  console.log("Token JWT:", token);

  const response = await fetch("http://localhost:8080/api/v1/pedidoVenta/Create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,  
    },
    body: JSON.stringify(pedido)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear el pedido: ${errorText}`);
  }

  return await response.json();
};

// PATCH Cambiar Estado de PedioVenta
export const cambiarEstadoPedidoVenta = async (
  id: number,
  nuevoEstado: Estado
): Promise<void> => {
  const response = await fetch(`/api/v1/pedidoVenta/${id}/estado`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoEstado),
  });

  if (!response.ok) {
    throw new Error("Error al cambiar el estado del pedido");
  }
};

// PATCH Agregar minutos desde COCINERO al PedidoVenta
export const agregarMinutosExtraPedido = async (id: number, minutosExtra: number) => {
  const res = await fetch(`/api/v1/pedidoVenta/${id}/minutos-extra`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ minutosExtra }), // 👈 CORREGIDO: ahora es un objeto con clave-valor
  });
  if (!res.ok) throw new Error("Error actualizando minutos extra");
};



