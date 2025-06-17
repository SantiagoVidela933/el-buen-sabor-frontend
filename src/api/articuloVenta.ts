import ArticuloVenta from '../models/ArticuloVenta';


const API_URL = 'http://localhost:8080/api/articulo-venta';

// GET Articulos para venta
export const getAllArticulosVenta = async (): Promise<ArticuloVenta[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al traer los artículos manufacturados');
  const data = await res.json();
  return data.map((item: any) => ArticuloVenta.fromJson(item));
};