import { CategoriaArticulo } from "../models/CategoriaArticulo";

// GET Categorias de Articulos Manufacturados
export async function getCategoriasMenuBySucursalId(sucursalId: number): Promise<CategoriaArticulo[]> {
  try {
    const response = await fetch(`http://localhost:8080/api/categoria/menu/${sucursalId}`);
    if (!response.ok) {
      throw new Error("Error al obtener las categorías de menú");
    }
    const data = await response.json();
    return data.map((item: any) => CategoriaArticulo.fromJson(item));
  } catch (error) {
    console.error("Error en getCategoriasMenuBySucursalId:", error);
    return [];
  }
}

// GET Categorias de Articulos Insumos
export async function getCategoriasInsumosBySucursalId(sucursalId: number): Promise<CategoriaArticulo[]> {
  try {
    const response = await fetch(`http://localhost:8080/api/categoria/insumos/${sucursalId}`);
    if (!response.ok) {
      throw new Error("Error al obtener las categorías de insumos");
    }
    const data = await response.json();
    return data.map((item: any) => CategoriaArticulo.fromJson(item));
  } catch (error) {
    console.error("Error en getCategoriasInsumosBySucursalId:", error);
    return [];
  }
}
