import { ArticuloManufacturado } from '../models/ArticuloManufacturado';

const BASE_URL = 'http://localhost:8080/api'; 

export async function getArticulosManufacturados(): Promise<ArticuloManufacturado[]> {
  const response = await fetch(`${BASE_URL}/articuloManufacturado`);

  if (!response.ok) {
    throw new Error('Error al obtener los artículos manufacturados');
  }

  const data = await response.json();
  return data.map((json: any) => ArticuloManufacturado.fromJson(json));
}
