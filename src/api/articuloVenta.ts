import ArticuloVenta from '../models/ArticuloVenta';


const API_URL = 'http://localhost:8080/api/articulo-venta';

// GET Articulos para venta
export const getAllArticulosVenta = async (): Promise<ArticuloVenta[]> => {
  const res = await fetch(API_URL);
  
  if (!res.ok) throw new Error('Error al traer los artículos manufacturados');
  const data = await res.json();
  return data.map((item: any) => ArticuloVenta.fromJson(item));
};

// GET Articulos por tipo
export const getArticulosByTipo = async (idSucursal:number,tipo: string): Promise<ArticuloVenta[]> => {
  const res = await fetch(`${API_URL}/sucursal/${idSucursal}/tipo/${tipo}`);
  
  if (!res.ok) throw new Error(`Error al traer los artículos de tipo ${tipo}`);
  
  const data = await res.json();
  console.log('Datos obtenidos del backend:', data); // Verifica aquí

  return data;
};