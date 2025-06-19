import { Promocion } from "../models/Promocion";

export async function getPromociones(): Promise<Promocion[]> {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/promociones`);
    if (!response.ok) {
      throw new Error("Error al obtener las promociones del menú");
    }
    const data = await response.json();
    const dataApi: Promocion[] = data.map((item: any) => Promocion.fromJson(item));
    console.log("Promociones obtenidas API:", data);
    return dataApi;
  } catch (error) {
    console.error("Error en getPromociones:", error);
    return [];
  }
}

// POST - Crear nueva categoría
export async function createPromocion(promocion: Partial<Promocion>): Promise<Promocion> {
  const response = await fetch(`http://localhost:8080/api/v1/promociones/Create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(promocion)
  });

  if (!response.ok) {
    throw new Error("Error al crear la promocion");
  }

  const data = await response.json();
  return Promocion.fromJson(data);
}

export async function updatePromocion(
  // data: {
  //   denominacion: string;
  //   sucursalId: number;
  // }
  data: Partial<Promocion>,
  id?: number
): Promise<Promocion> {
  const response = await fetch(`http://localhost:8080/api/v1/promociones/Update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la promocion");
  }

  const json = await response.json();
  return Promocion.fromJson(json);
}