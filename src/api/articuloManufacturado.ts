import { ArticuloManufacturado } from '../models/ArticuloManufacturado';

const API_URL = 'http://localhost:8080/api/articuloManufacturado';

// GET Articulos Manufacturados
export const getAllArticulosManufacturados = async (): Promise<ArticuloManufacturado[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al traer los artículos manufacturados');
  const data = await res.json();
  return data.map((item: any) => ArticuloManufacturado.fromJson(item));
};

// POST Articulo Manufacturado
export const createArticuloManufacturado = async (articulo: ArticuloManufacturado) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(articulo),
  });
  if (!res.ok) throw new Error('Error al crear artículo manufacturado');
  return res.json();
};

