import { ArticuloInsumo } from "../models/ArticuloInsumo";

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
