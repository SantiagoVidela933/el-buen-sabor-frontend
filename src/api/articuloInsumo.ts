import { ArticuloInsumo } from "../models/ArticuloInsumo";

const API_URL = "http://localhost:8080/api/articuloInsumo";

// GET Articulos Insumo por sucursal
export async function getInsumosBySucursalId(sucursalId: number): Promise<ArticuloInsumo[]> {
  try {
    const response = await fetch(`http://localhost:8080/api/articuloInsumo/sucursal/${sucursalId}`);
    if (!response.ok) {
      throw new Error("Error al obtener los artículos insumo");
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.warn("La respuesta del servidor no es una lista:", data);
      return [];
    }

    return data.map((item: any) => ArticuloInsumo.fromJson(item));
  } catch (error) {
    console.error("Error en getInsumosBySucursalId:", error);
    return [];
  }
}

// GET Articulos Insumos
export async function getAllArticuloInsumo(): Promise<ArticuloInsumo[]> {
  const res = await fetch(`${API_URL}/todos`);
  const data = await res.json();
  return data.map((item: any) => ArticuloInsumo.fromJson(item));
}

// POST Articulos Insumo
export async function createArticuloInsumo(insumoPayload: object): Promise<ArticuloInsumo> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(insumoPayload),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('[ERROR] Backend response:', errorText);
    throw new Error('Error al crear insumo');
  }
  const data = await res.json();
  return ArticuloInsumo.fromJson(data);
}

// PUT Articulos Insumo
export async function updateArticuloInsumo(id: number | string, insumoPayload: object): Promise<ArticuloInsumo> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(insumoPayload),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('[ERROR] Backend response:', errorText);
    throw new Error('Error al actualizar insumo');
  }
  const data = await res.json();
  return ArticuloInsumo.fromJson(data);
}

// DELETE Articulo Insumo ( logico )
export async function deleteArticuloInsumo(id: number): Promise<void> {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}

export const darDeBajaArticuloInsumo = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}/darBaja`, {
    method: 'PATCH',
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('[ERROR dar de baja]:', errorText);
    throw new Error('Error al dar de baja el artículo insumo');
  }
};

export const darDeAltaArticuloInsumo = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}/darAlta`, {
    method: 'PATCH',
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('[ERROR dar de alta]:', errorText);
    throw new Error('Error al dar de alta el artículo insumo');
  }
};

