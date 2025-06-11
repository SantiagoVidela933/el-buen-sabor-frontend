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
  const res = await fetch(API_URL);
  const data = await res.json();
  return data.map((item: any) => ArticuloInsumo.fromJson(item));
}

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

export async function deleteArticuloInsumo(id: number): Promise<void> {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
