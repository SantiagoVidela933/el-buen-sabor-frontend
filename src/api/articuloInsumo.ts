import { ArticuloInsumo } from "../models/ArticuloInsumo";

// GET Articulos Insumo
export async function getInsumosBySucursalId(sucursalId: number): Promise<ArticuloInsumo[]> {
  try {
    const response = await fetch(`http://localhost:8080/api/articuloInsumo/sucursal/${sucursalId}`);
    if (!response.ok) {
      throw new Error("Error al obtener las categorías de menú");
    }
    const data = await response.json();
    return data.map((item: any) => ArticuloInsumo.fromJson(item));
  } catch (error) {
    console.error("Error en getCategoriasMenuBySucursalId:", error);
    return [];
  }
}