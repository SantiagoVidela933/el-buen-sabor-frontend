import { Promocion } from "../models/Promocion";

export async function getPromociones(): Promise<Promocion[]> {
  const response = await fetch(`http://localhost:8080/api/v1/promociones`);

  if (!response.ok) {
    return response.text().then(errorText => {
      throw new Error(errorText || 'Error desconocido en el servidor');
    });
  }

  const data = await response.json();
  const dataApi: Promocion[] = data.map((item: any) => Promocion.fromJson(item));
  return dataApi;
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

  if (!response.ok) {
    return response.text().then(errorText => {
      throw new Error(errorText || 'Error desconocido en el servidor');
    });
  }

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
      // Si la respuesta no es OK (por ejemplo, status 500), leemos el texto del body.
        return response.text().then(errorText => {
        // Lanzamos un error con el texto del cuerpo.
        throw new Error(errorText || 'Error desconocido en el servidor');
      });
    }
    
    const json = await response.json();
    const data = Promocion.fromJson(json);
    return data;
}

// DELETE Articulo Manufacturado por ID
export const deletePromocion = async (id?: number): Promise<void> => {
  const response = await fetch(`http://localhost:8080/api/v1/promociones/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    return response.text().then(errorText => {
      throw new Error(errorText || 'Error desconocido en el servidor');
    });
  }
};

export const darDeAltaPromocion = async (id: number): Promise<void> => {
  const response = await fetch(`http://localhost:8080/api/v1/promociones/alta/${id}`, {
    method: 'PUT',
  });
  
  if (!response.ok) {
    return response.text().then(errorText => {
      throw new Error(errorText || 'Error desconocido en el servidor');
    });
  }
};