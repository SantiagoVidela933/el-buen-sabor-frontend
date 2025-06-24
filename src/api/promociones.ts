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
export async function createPromocion(
   promocion: Partial<Promocion>,
   imagen: File
): Promise<Promocion> {
  const formData = new FormData();
  const promocionBlob = new Blob([JSON.stringify(promocion)], {
    type: 'application/json',
  });

  formData.append('promocion', promocionBlob);
  if (imagen) {
    formData.append('imagenes', imagen);
  }

  const response = await fetch(`http://localhost:8080/api/v1/promociones/Create`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return Promocion.fromJson(data);
}

export async function updatePromocion(
  promocion: Partial<Promocion>,
  imagen: File,
  id?: number
): Promise<Promocion> {
    console.log("ID:", id);

    const formData = new FormData();
    const promocionBlob = new Blob([JSON.stringify(promocion)], {
      type: 'application/json',
    });

    formData.append('promocion', promocionBlob);
    if (imagen) {
      formData.append('imagenes', imagen);
    }

    const response = await fetch(`http://localhost:8080/api/v1/promociones/Update/${id}`, {
      method: 'PUT',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Error al actualizar la promocion");
    }
    
    const json = await response.json();
    const data = Promocion.fromJson(json);
    return data;
}

// DELETE Articulo Manufacturado por ID
export const deletePromocion = async (id?: number): Promise<void> => {
  const res = await fetch(`http://localhost:8080/api/v1/promociones/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('[ERROR] Backend response:', errorText);
    throw new Error('Error al eliminar artículo manufacturado');
  }
};

export const darDeAltaPromocion = async (id: number): Promise<void> => {
  const res = await fetch(`http://localhost:8080/api/v1/promociones/alta/${id}`, {
    method: 'PUT',
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('[ERROR] Backend response:', errorText);
    throw new Error('Error al dar de alta el artículo manufacturado');
  }
};