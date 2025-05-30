import { ArticuloManufacturado } from '../models/ArticuloManufacturado';

const API_URL = 'http://localhost:8080/api/articuloManufacturado';

// GET Articulos Manufacturados
export const getAllArticulosManufacturados = async (): Promise<ArticuloManufacturado[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al traer los artículos manufacturados');
  const data = await res.json();
  return data.map((item: any) => ArticuloManufacturado.fromJson(item));
};

// POST Articulo Manufacturado con imagen
export const createArticuloManufacturado = async (
  articuloPayload: object,
  imagen: File
) => {
  const formData = new FormData();
  const articuloBlob = new Blob([JSON.stringify(articuloPayload)], {
    type: 'application/json',
  });
  formData.append('articuloManufacturado', articuloBlob);
  if (imagen) {
    formData.append('imagenes', imagen);
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('[ERROR] Backend response:', errorText);
    throw new Error('Error al crear artículo manufacturado');
  }
  return res.json();
};

// PUT Articulo Manufacturado con imagen
export const updateArticuloManufacturado = async (
  id: number | string,
  articuloPayload: object,
  imagen?: File
) => {
  const formData = new FormData();
  console.log('[DEBUG] Payload a enviar:', articuloPayload);
  const articuloBlob = new Blob([JSON.stringify(articuloPayload)], {
    type: 'application/json',
  });
  formData.append('articuloManufacturado', articuloBlob);
  if (imagen) {
    formData.append('imagenes', imagen);
  }
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('[ERROR] Backend response:', errorText);
    throw new Error('Error al actualizar artículo manufacturado');
  }
  return res.json();
};

// DELETE Articulo Manufacturado por ID
export const deleteArticuloManufacturado = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('[ERROR] Backend response:', errorText);
    throw new Error('Error al eliminar artículo manufacturado');
  }
};


